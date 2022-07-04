import React, { useState } from 'react';
import InputFormScale from '../InputFormScale';
import InputFormText from '../InputFormText';
import InputFormNum from '../InputFormNum';

function NewIntervalForm({data, updateSrc, setToggle, scales, activeScale, history, setHistory}) {

  const [values, setValues] = useState({
    text: '',
    xValue1:'',
    yValue1:'',
    xValue2:'',
    yValue2:'',
    xScale:activeScale[0],
    yScale:activeScale[1],
    color:'',
    opacity:'',
    width:''
  });

  // const [text, setText] = useState("");
  // const [xValue1, setXValue1] = useState("");
  // const [yValue1, setYValue1] = useState("");
  // const [xValue2, setXValue2] = useState("");
  // const [yValue2, setYValue2] = useState("");
  // const [select, setSelect] = useState(activeScale);
  // // const scalesList = Object.keys(scales).map((key, i) => {
  // //   return <option value={key} key={i}>{key}</option>
  // // });
  // //optional parameters
  // const [color, setColor] = useState("");
  // const [opacity, setOpacity] = useState("");
  // const [width, setWidth] = useState("");
  // const [dashed, setDashed] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    //checkbox is being weird (value updates 1 render behind), setting its values directly
    const { value, name } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newData = {...data};
    const lastKey = Object.keys(newData).pop() ? parseInt(Object.keys(newData).pop()) : -1;
    const lastInstant = newData[lastKey]; //last instant of data

    const tempX1 = parseFloat(values.xValue1);
    const tempY1 = values.yValue1 ? parseFloat(values.yValue1) : null; //if y pos specified, convert to float. otherwise, return null
    const tempX2 = parseFloat(values.xValue2);
    const tempY2 = values.yValue2 ? parseFloat(values.yValue2) : null;

    //error handling. btw, isNan(null) === false
    if (isNaN(tempX1)) {
      alert("Enter a value for Start Time!");
      return;
    } else if (isNaN(tempY1)) {
      alert("Enter a value for Start Y Value!");
      return;
    } else if (isNaN(tempX2)) {
      alert("Enter a value for End Time!");
      return;
    } else if (isNaN(tempY2)) {
      alert("Enter a value for End Y Value!");
      return;
    } else {
      //generate first instant
      newData[`${lastKey+1}`] = {
        "text": "",
        "x":tempX1,
        "y": values.yValue1 ? tempY1 : ( lastInstant ? lastInstant.y : 0 ), // if y not specified, take value of last instant
        "scale": [values.xScale, values.yScale],
        "target": [`${lastKey+2}`],
        ...(values.text && {"intervalText": values.text}),
        ...(values.color && {"intervalColor": values.color, "color":values.color}),
        ...(values.width && {"intervalWidth": values.width}),
        ...(values.opacity && {"intervalOpacity": values.opacity, "opacity":values.opacity})
      };
      //generate second instant
      newData[`${lastKey+2}`] = {
        "text": "",
        "x":tempX2,
        "y": values.yValue2 ? tempY2 : ( lastInstant ? lastInstant.y : 0 ), // if y not specified, take value of last instant
        "scale": [values.xScale, values.yScale],
        "target": null,
        ...(values.color && {"color":values.color}),
        ...(values.opacity && {"opacity":values.opacity})
      };
    };

    updateSrc(newData);
  };

  const handleClose = (e) => {
    setToggle(null);
    e.preventDefault();
  }

/*
<label>
  Dashed
  <input
    type="text"
    placeholder="i.e: 5"
    value={dashed}
    onChange={handleChange}
  />
</label><br/><br/>
*/
  return (
    <form className="ui absolute center container">
      <InputFormText
        label="Label"
        name="text"
        onChange={handleChange}
        value={values.text}
      />
      <InputFormScale
        scales={scales.x}
        label="X Scale"
        name="xSelect"
        value={values.xSelect}
        onChange={handleChange}
      />
      <InputFormScale
        scales={scales.y}
        label="Y Scale"
        name="ySelect"
        value={values.ySelect}
        onChange={handleChange}
      /><br/>
      <span className="textSecondary bold">Start:</span>
      <InputFormNum
        label="Time"
        name="xValue1"
        placeholder="numbers only for now"
        value={values.xValue1}
        onChange={handleChange}
        required
      />
      <InputFormNum
        label="Y Value"
        name="yValue1"
        placeholder="numbers only for now"
        value={values.yValue1}
        onChange={handleChange}
        required
      /><br/>
      <span className="textSecondary bold">End:</span>
      <InputFormNum
        label="Time"
        name="xValue2"
        placeholder="numbers only for now"
        value={values.xValue2}
        onChange={handleChange}
        required
      />
      <InputFormNum
        label="Y Value"
        placeholder="numbers only for now"
        name="yValue2"
        value={values.yValue2}
        onChange={handleChange}
        required
      /><br/>
      <span className="textSecondary bold">Properties:</span>
      <InputFormText
        label="Color"
        name="color"
        placeholder="blue, #4DA6FF, etc."
        value={values.color}
        onChange={handleChange}
      />
      <InputFormNum
        label="Certainty"
        name="opacity"
        placeholder="0 to 1 (default 1)"
        value={values.opacity}
        onChange={handleChange}
      />
      <InputFormNum
        label="Width"
        name="width"
        placeholder="(default 3)"
        value={values.width}
        onChange={handleChange}
      /><br/>
      <div className="flexCenter">
        <button className="buttonSecondary" onClick={handleClose}>Cancel</button> &nbsp;
        <button className="buttonSecondary" onClick={handleSubmit}>Submit</button>
      </div>
    </form>
  )
}

export default NewIntervalForm;
