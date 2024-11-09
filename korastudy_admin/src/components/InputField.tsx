import { FieldError, UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  type?: string;
  defaultValue?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  register,
  error,
  type = "text",
  defaultValue,
  className,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
      />
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  );
};

export default InputField;
