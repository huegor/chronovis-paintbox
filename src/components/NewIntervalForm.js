import React, { useState } from 'react';
import InputFormScale from './InputFormScale';
import InputFormText from './InputFormText';
import InputFormNum from './InputFormNum';

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
    if (isNaN(tempX1) || isNaN(tempY1) || isNaN(tempX2) || isNaN(tempY2)) {
      alert("Make sure all Times and y Positions are numbers!");
    } else {
      //generate first instant
      newData[`${lastKey+1}`] = {
        "text": "",
        "x":tempX1,
        "y": values.yValue1 ? tempY1 : ( lastInstant ? lastInstant.y : 0 ), // if y not specified, take value of last instant
        "scale": [values.xScale, values.yScale],
        "target": [`${lastKey+2}`],
        ...(values.text && {"intervalText": values.text}),
        ...(values.color && {"intervalColor": values.color}),
        ...(values.width && {"intervalWidth": values.width}),
        ...(values.opacity && {"intervalOpacity": values.opacity})
      };
      //generate second instant
      newData[`${lastKey+2}`] = {
        "text": "",
        "x":tempX2,
        "y": values.yValue2 ? tempY2 : ( lastInstant ? lastInstant.y : 0 ), // if y not specified, take value of last instant
        "scale": [values.xScale, values.yScale],
        "target": null
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
      <label>
        Label<span className="redText">* </span>
        <input
          type="text"
          name="text"
          placeholder="any unicode character"
          value={values.text}
          onChange={handleChange}
        />
      </label><br/>
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
      />
      <b>Start:</b><br/>
      <label>
        Time<span className="redText">* </span>
        <input
          type="text"
          name="xValue1"
          placeholder="numbers only"
          value={values.xValue1}
          onChange={handleChange}
          required
        />
      </label><br/>
      <label>
        y Position
        <input
          type="text"
          name="yValue1"
          placeholder="#s only (default 0)"
          value={values.yValue1}
          onChange={handleChange}
        />
      </label><br/>
      <b>End:</b><br/>
      <label>
        Time<span className="redText">* </span>
        <input
          type="text"
          name="xValue2"
          placeholder="numbers only"
          value={values.xValue2}
          onChange={handleChange}
          required
        />
      </label><br/>
      <label>
        y Position
        <input
          type="text"
          placeholder="#s only (default 0)"
          name="yValue2"
          value={values.yValue2}
          onChange={handleChange}
        />
      </label><br/>
      <b>Properties:</b><br/>
      <label>
        Color
        <input
          type="text"
          placeholder="blue, #4DA6FF, etc."
          name="color"
          value={values.color}
          onChange={handleChange}
        />
      </label><br/>
      <label>
        Width
        <input
          type="number"
          name="width"
          placeholder="1.67"
          value={values.width}
          onChange={handleChange}
        />
      </label><br/>
      <label>
        Certainty
        <input
          type="number"
          placeholder="0-1"
          name="opacity"
          value={values.opacity}
          onChange={handleChange}
        />
      </label><br/>
      <div className="flexCenter">
        <button className="buttonSecondary" onClick={handleClose}>Cancel</button> &nbsp;
        <button className="buttonSecondary" onClick={handleSubmit}>Submit</button>
      </div>
    </form>
  )
}

export default NewIntervalForm;
