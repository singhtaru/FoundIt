function FormInput({
  label,
  type = 'text',
  placeholder,
  as = 'input',
  options = [],
  className = '',
  ...props
}) {
  return (
    <label className={`form-field ${className}`.trim()}>
      {label && <span className="form-label">{label}</span>}
      {as === 'textarea' ? (
        <textarea className="form-control textarea" placeholder={placeholder} {...props} />
      ) : as === 'select' ? (
        <select className="form-control" value={props.value !== undefined ? props.value : ""} {...props}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input className="form-control" type={type} placeholder={placeholder} {...props} />
      )}
    </label>
  );
}

export default FormInput;
