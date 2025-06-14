interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  error?: string;
  placeholder?: string;
}

export default function TextInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  className = "",
  error,
  placeholder,
}: TextInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-secondary mb-1">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <input
        type={type || "text"}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? "border-error" : ""
        } ${className || ""}`}
        placeholder={placeholder}
        required={required}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
