"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import * as XLSX from "xlsx";

const schema = z.object({
  vocabularySetName: z
    .string()
    .min(1, { message: "Tên bộ từ vựng phải có ít nhất 1 ký tự!" })
    .max(50, { message: "Tên bộ từ vựng không được dài quá 50 ký tự!" }),
  topikLevel: z.string().min(1, { message: "Chọn cấp độ Topik!" }),
  file: z
    .any()
    .refine((file) => file && file[0] && ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file[0].type), {
      message: "Yêu cầu tệp Excel hợp lệ!",
    }),
});

type VocabularyInputs = z.infer<typeof schema>;

const VocabularyForm = ({
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
  } = useForm<VocabularyInputs>({
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

        // Tạo vocabulary_set với tên và topik level từ input
        const vocabularySetRef = await addDoc(collection(db, "vocabulary_sets"), {
          name: formData.vocabularySetName,
          topikLevel: formData.topikLevel,
          createdAt: new Date(),
        });

        // Thêm từ vựng vào vocabulary_set
        type VocabularyItem = {
          word: string;
          meaning: string;
          url: string;
        };

        for (const item of jsonData as VocabularyItem[]) {
          await addDoc(collection(db, "vocabulary_sets", vocabularySetRef.id, "vocabularies"), {
            word: item.word,
            meaning: item.meaning,
            url: item.url,
            createdAt: new Date(),
          });
        }
        console.log("Vocabulary added successfully");
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error adding vocabulary: ", error);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Vocabulary Set" : "Update Vocabulary Set"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Vocabulary Set Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Vocabulary Set Name"
          name="vocabularySetName"
          register={register}
          error={errors.vocabularySetName}
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

export default VocabularyForm;