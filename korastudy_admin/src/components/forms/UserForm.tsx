"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Tên phải có ít nhất 3 ký tự!" })
    .max(50, { message: "Tên không được dài quá 50 ký tự!" }),
  email: z.string().email({ message: "Email không hợp lệ!" }),
  phone: z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ!" })
    .max(15, { message: "Số điện thoại không được dài quá 15 ký tự!" }),
  address: z.string().min(5, { message: "Yêu cầu địa chỉ đầy đủ!" }),
  dateOfBirth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: "Ngày sinh không hợp lệ!" }),
  nation: z.enum(["VietNam", "America"], { message: "Yêu cầu quốc gia!" }),
  photo: z.instanceof(File, { message: "Yêu cầu đường dẫn ảnh hợp lệ!" }),
  vipStatus: z.boolean().optional(),
});

type UserInputs = z.infer<typeof schema>;

const UserForm = ({
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
  } = useForm<UserInputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New User" : "Update User"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
          className="md:w-1/4"
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
          className="md:w-1/4"
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
          className="md:w-1/4"
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
          className="flex-grow"
        />
        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          defaultValue={data?.dateOfBirth}
          register={register}
          error={errors.dateOfBirth}
          type="date"
          className="md:w-1/4"
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Nation</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("nation")}
            defaultValue={data?.nation}
          >
            <option value="VietNam">VietNam</option>
            <option value="America">America</option>
          </select>
          {errors.nation?.message && (
            <p className="text-xs text-red-400">{errors.nation.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">VIP Status</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("vipStatus")}
            defaultValue={data?.vipStatus ? "true" : "false"}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          {errors.vipStatus?.message && (
            <p className="text-xs text-red-400">{errors.vipStatus.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="photo"
          >
            <Image src="/upload.png" alt="Upload Icon" width={28} height={28} />
            <span>Upload a Photo</span>
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

export default UserForm;
