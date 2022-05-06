const InputFormScale = ({scales, label, name, value, onChange}) => {
  const list = Object.keys(scales).map((key, i) => {
    return <option value={key} key={i}>{key}</option>
  });

  return (
    <label className="textSecondary">
      {label}<span className="redText">* </span>
      <select name={name} value={value} onChange={onChange}>
        {list}
      </select>
    </label>
  )
};

export default InputFormScale;
