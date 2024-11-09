"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Tên từ vựng phải có ít nhất 3 ký tự!" })
    .max(50, { message: "Tên từ vựng không được dài quá 50 ký tự!" }),
  topik: z.string().min(1, { message: "Chọn cấp độ Topik!" }),
  vocabularyId: z.string().min(1, { message: "Yêu cầu ID từ vựng!" }),
  file: z.instanceof(File, { message: "Yêu cầu tệp hợp lệ!" }),
  content: z.string().min(5, { message: "Nội dung không thể thiếu!" }),
  upDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: "Ngày không hợp lệ!" }),
  photo: z.instanceof(File, { message: "Yêu cầu ảnh hợp lệ!" }),
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

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Vocabulary" : "Update Vocabulary"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Vocabulary Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Vocabulary Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
          className="md:w-1/4"
        />
        <InputField
          label="Topik Level"
          name="topik"
          defaultValue={data?.topik}
          register={register}
          error={errors.topik}
          className="md:w-1/4"
        />
        <InputField
          label="Vocabulary ID"
          name="vocabularyId"
          defaultValue={data?.vocabularyId}
          register={register}
          error={errors.vocabularyId}
          className="md:w-1/4"
        />
        <InputField
          label="Content"
          name="content"
          defaultValue={data?.content}
          register={register}
          error={errors.content}
          className="flex-grow"
        />
        <InputField
          label="Date Updated"
          name="upDate"
          defaultValue={data?.upDate}
          register={register}
          error={errors.upDate}
          type="date"
          className="md:w-1/4"
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        File and Photo Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Upload File</label>
          <input
            type="file"
            {...register("file")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {errors.file?.message && (
            <p className="text-xs text-red-400">{errors.file.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="photo"
          >
            <Image src="/upload.png" alt="Upload Icon" width={28} height={28} />
            <span>Upload Photo</span>
          </label>
          <input
            type="file"
            id="photo"
            {...register("photo")}
            className="hidden"
          />
          {errors.photo?.message && (
            <p className="text-xs text-red-400">{errors.photo.message}</p>
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
