interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
  error?: string;
}

export default function TextArea({
  label,
  name,
  value,
  onChange,
  required = false,
  className = "",
  error,
}: TextAreaProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7159b5] ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
