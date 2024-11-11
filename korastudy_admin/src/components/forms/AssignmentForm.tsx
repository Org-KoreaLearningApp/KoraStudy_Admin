// src/components/forms/GrammarForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const schema = z.object({
  grammarSetName: z
    .string()
    .min(1, { message: "Tên bộ ngữ pháp phải có ít nhất 1 ký tự!" })
    .max(50, { message: "Tên bộ ngữ pháp không được dài quá 50 ký tự!" }),
  topikLevel: z.string().min(1, { message: "Chọn cấp độ Topik!" }),
  word: z.string().min(1, { message: "Yêu cầu từ vựng!" }),
  mean: z.string().min(1, { message: "Yêu cầu nghĩa!" }),
  describe: z.string().min(1, { message: "Yêu cầu mô tả!" }),
  use: z.string().min(1, { message: "Yêu cầu cách dùng!" }),
  example: z.string().min(1, { message: "Yêu cầu ví dụ!" }),
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
      const grammarSetRef = await addDoc(collection(db, "grammar_sets"), {
        name: formData.grammarSetName,
        topikLevel: formData.topikLevel,
        createdAt: new Date(),
      });

      await addDoc(collection(db, "grammar_sets", grammarSetRef.id, "grammars"), {
        word: formData.word,
        mean: formData.mean,
        describe: formData.describe,
        use: formData.use,
        example: formData.example,
        createdAt: new Date(),
      });

      console.log("Grammar added successfully");
    } catch (error) {
      console.error("Error adding grammar: ", error);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Grammar Set" : "Update Grammar Set"}
      </h1>
      <InputField
        label="Grammar Set Name"
        name="grammarSetName"
        register={register}
        error={errors.grammarSetName}
      />
      <InputField
        label="Topik Level"
        name="topikLevel"
        register={register}
        error={errors.topikLevel}
      />
      <InputField
        label="Word"
        name="word"
        register={register}
        error={errors.word}
      />
      <InputField
        label="Mean"
        name="mean"
        register={register}
        error={errors.mean}
      />
      <InputField
        label="Describe"
        name="describe"
        register={register}
        error={errors.describe}
      />
      <InputField
        label="Use"
        name="use"
        register={register}
        error={errors.use}
      />
      <InputField
        label="Example"
        name="example"
        register={register}
        error={errors.example}
      />
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default GrammarForm;