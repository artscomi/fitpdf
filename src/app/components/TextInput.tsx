import { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export default function TextInput({
  label,
  error,
  required,
  className = "",
  ...rest
}: TextInputProps) {
  const baseClasses =
    "mt-1 block w-full h-[40px] rounded-[4px] border-gray-300 border-1 focus:border-blue-500 focus:ring-blue-500 p-2";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input {...rest} className={`${baseClasses} ${className}`} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
