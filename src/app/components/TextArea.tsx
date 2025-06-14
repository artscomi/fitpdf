interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
  error?: string;
  placeholder?: string;
  rows?: number;
}

export default function TextArea({
  label,
  name,
  value,
  onChange,
  required = false,
  className = "",
  error,
  placeholder,
  rows = 4,
}: TextAreaProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-secondary mb-1">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? "border-error" : ""
        } ${className || ""}`}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
