"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import * as XLSX from "xlsx";

const schema = z.object({
  grammarSetName: z
    .string()
    .min(1, { message: "Tên bộ ngữ pháp phải có ít nhất 1 ký tự!" })
    .max(50, { message: "Tên bộ ngữ pháp không được dài quá 50 ký tự!" }),
  topikLevel: z.string().min(1, { message: "Chọn cấp độ Topik!" }),
  file: z
    .any()
    .refine((file) => file && file[0] && ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file[0].type), {
      message: "Yêu cầu tệp Excel hợp lệ!",
    }),
});

type GrammarInputs = z.infer<typeof schema>;

const GrammarForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GrammarInputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const file = formData.file[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target) {
          console.error("FileReader event target is null");
          return;
        }
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("jsonData:", jsonData);

        // Tạo grammar_set với tên và topik level từ input
        const grammarSetRef = await addDoc(collection(db, "grammar_sets"), {
          name: formData.grammarSetName,
          topikLevel: formData.topikLevel,
          createdAt: new Date(),
        });

        console.log("grammarSetRef ID:", grammarSetRef.id);

        // Thêm ngữ pháp vào grammar_set
        type GrammarItem = {
          name: string;
          use: string;
          mean: string;
          example: string;
          describe: string;
        };

        for (const item of jsonData as GrammarItem[]) {
          // Kiểm tra và xử lý các giá trị undefined
          const name = item.name || "";
          const use = item.use || "";
          const mean = item.mean || "";
          const example = item.example || "";
          const describe = item.describe || "";

          console.log("Grammar Item:", { name, use, mean, example, describe });

          await addDoc(collection(db, "grammar_sets", grammarSetRef.id, "grammars"), {
            name,
            use,
            mean,
            example,
            describe,
            createdAt: new Date(),
          });
        }
        console.log("Grammar added successfully");
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error adding grammar: ", error);
    }
  });
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Grammar Set" : "Update Grammar Set"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Grammar Set Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Grammar Set Name"
          name="grammarSetName"
          register={register}
          error={errors.grammarSetName}
          className="md:w-1/2"
        />
        <InputField
          label="Topik Level"
          name="topikLevel"
          register={register}
          error={errors.topikLevel}
          className="md:w-1/2"
        /> 
      </div>
      <span className="text-xs text-gray-400 font-medium">
        File Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Upload File</label>
          <input
            type="file"
            {...register("file")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {errors.file?.message && typeof errors.file.message === "string" && (
            <p className="text-xs text-red-400">{errors.file.message}</p>
          )}
        </div>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default GrammarForm;