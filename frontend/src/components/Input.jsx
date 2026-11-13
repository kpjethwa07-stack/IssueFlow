
export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}) {
  return (
    <div className={`form-field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}

      <input
        id={id}
        className={`form-input ${error ? "input-error" : ""}`}
        {...props}
      />

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
