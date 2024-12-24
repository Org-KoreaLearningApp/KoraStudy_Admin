"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import * as XLSX from "xlsx";
import { useState } from "react";

const schema = z.object({
  description: z
    .string()
    .min(1, { message: "Mô tả phải có ít nhất 1 ký tự!" })
    .max(200, { message: "Mô tả không được dài quá 200 ký tự!" }),
  listeningScore: z
    .string()
    .min(0, { message: "Điểm nghe phải lớn hơn hoặc bằng 0!" }),
  readingScore: z
    .string()
    .min(0, { message: "Điểm đọc phải lớn hơn hoặc bằng 0!" }),
  testName: z
    .string()
    .min(1, { message: "Tên bài kiểm tra phải có ít nhất 1 ký tự!" })
    .max(50, { message: "Tên bài kiểm tra không được dài quá 50 ký tự!" }),
  totalQuestion: z
    .string()
    .min(1, { message: "Tổng số câu hỏi phải lớn hơn hoặc bằng 1!" }),
  totalScore: z
    .string()
    .min(1, { message: "Tổng điểm phải lớn hơn hoặc bằng 1!" }),
  audioUrl: z
    .string()
    .url({ message: "Yêu cầu URL hợp lệ!" })
    .optional(),
  file: z
    .any()
    .refine((file) => file && file[0] && ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file[0].type), {
      message: "Yêu cầu tệp Excel hợp lệ!",
    }),
});

type ExamInputs = z.infer<typeof schema>;

const ExamForm = ({
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
  } = useForm<ExamInputs>({
    resolver: zodResolver(schema),
  });

  const [successMessage, setSuccessMessage] = useState("");

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

        // Tạo Exam_set với tên và topik level từ input
        const ExamSetRef = await addDoc(collection(db, "testpage"), {
          description: formData.description,
          listeningScore: formData.listeningScore,
          readingScore: formData.readingScore,
          testName: formData.testName,
          totalQuestion: formData.totalQuestion,
          totalScore: formData.totalScore,
          audioUrl: formData.audioUrl || null,
          createdAt: new Date(),
        });

        // Thêm từ vựng vào Exam_set
        type questions = {
          choiceA: string;
          choiceB: string;
          choiceC: string;
          choiceD: string;
          correctAnswer: string;
          questionText : string;
          questionType : string;
          score : number;
          
        };

        for (let i = 0; i < jsonData.length; i++) {
          const item = jsonData[i] as questions;
          await addDoc(collection(db, "testpage", ExamSetRef.id, "questions"), {
            choiceA: item.choiceA || "default-choiceA",
            choiceB: item.choiceB || "default-choiceB",
            choiceC: item.choiceC || "default-choiceC",
            choiceD: item.choiceD || "default-choiceD",
            correctAnswer: item.correctAnswer || "default-correctAnswer",
            questionText: item.questionText || "default-questionText",
            questionType: item.questionType || "default-questionType",
            score: item.score || 0,
            order: i + 1, // Thêm trường order để lưu thứ tự câu hỏi
            createdAt: new Date(),
          });
        }
        setSuccessMessage("Thêm bài thi thành công");
        console.log("Exam added successfully");
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error adding Exam: ", error);
    }
  });

  return (
    <div className="p-4">
      <form className="flex flex-col gap-8 max-h-screen overflow-y-auto" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create a New Exam Set" : "Update Exam Set"}
        </h1>
        <span className="text-xs text-gray-400 font-medium">
          Exam Set Information
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Description"
            name="description"
            register={register}
            error={errors.description}
          />
          <InputField
            label="Listening Score"
            name="listeningScore"
            register={register}
            error={errors.listeningScore}
          />
          <InputField
            label="Reading Score"
            name="readingScore"
            register={register}
            error={errors.readingScore}
          />
          <InputField
            label="Test Name"
            name="testName"
            register={register}
            error={errors.testName}
          />
          <InputField
            label="Total Questions"
            name="totalQuestion"
            register={register}
            error={errors.totalQuestion}
          />
          <InputField
            label="Total Score"
            name="totalScore"
            register={register}
            error={errors.totalScore}
          />
          <InputField
            label="Audio URL"
            name="audioUrl"
            register={register}
            error={errors.audioUrl}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          File Information
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
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
        {successMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default ExamForm;