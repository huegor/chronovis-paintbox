const InputFormText = ({label, name, placeholder, value, handleChange, required}) => {
  return (
    <label className="textSecondary">
      {label} {required && <span className="redText">* </span>}
      <input type="text"
        placeholder={placeholder?placeholder:"any unicode characters"}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </label>
  );
}

export default InputFormText;
