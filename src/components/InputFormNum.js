const InputFormNum = ({label, name, value, placeholder, onChange, required}) => {
  return (
    <label className="textSecondary">
      {label} {required && <span className="redText">* </span>}
      <input type="number"
        placeholder={placeholder?placeholder:"integer or decimal"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}

export default InputFormNum;
