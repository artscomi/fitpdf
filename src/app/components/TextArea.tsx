import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export default function TextArea({
  label,
  error,
  required,
  className = "",
  ...rest
}: TextAreaProps) {
  const baseClasses =
    "mt-1 block w-full rounded-[4px] border-gray-300 border-1 focus:border-blue-500 focus:ring-blue-500 p-2";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea {...rest} className={`${baseClasses} ${className}`} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
