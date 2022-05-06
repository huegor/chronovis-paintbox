const InputFormNum = ({label, name, value, placeholder, handleChange, required}) => {
  return (
    <label className="textSecondary">
      {label} {required && <span className="redText">* </span>}
      <input type="text"
        placeholder={placeholder?placeholder:"Any real number"}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </label>
  );
}

export default InputFormNum;
