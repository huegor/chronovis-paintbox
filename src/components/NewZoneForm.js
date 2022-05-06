import React, { useState } from 'react';
import InputFormScale from './InputFormScale';
import InputFormText from './InputFormText';
import InputFormNum from './InputFormNum';

/*
   UI and function for adding new zones.
*/

function NewZoneForm({zones, updateSrc, setToggle, scales, activeScale}) {
  const [values, setValues] = useState({
    text: '',
    xScale:activeScale[0],
    yScale:activeScale[1],
    start:'',
    end:'',
    yValue2:'',
    yStart:'',
    yEnd:'',
    color:'',
    opacity:''
  });

  const [label, setLabel] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [select, setSelect] = useState(activeScale);
  //go thru list of scales in ChronoJSON and create a selection entry for each
  const scalesList = Object.keys(scales).map((key, i) => {
    return <option value={key} key={i}>{key}</option>
  });
  //optional parameters
  const [yStart, setYStart] = useState("");
  const [yEnd, setYEnd] = useState("");
  const [color, setColor] = useState("");
  const [opacity, setOpacity] = useState("");

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
    const newZones = {...zones};
    const lastKey = Object.keys(newZones).pop() ? parseInt(Object.keys(newZones).pop()) : -1;

    //generate new zone
    newZones[`${lastKey+1}`] = {
      "text": values.text,
      "start": parseFloat(values.start), //cases where start > end?
      "end": parseFloat(values.end),
      "scale": [values.xScale, values.yScale],
      ...(values.yStart && {"yStart": values.yStart}),
      ...(values.yEnd && {"yEnd": values.yEnd}),
      ...(values.color && {"color": values.color}),
      ...(values.opacity && {"opacity": values.opacity})
    }

    updateSrc(newZones,"zones");
    e.preventDefault();
  };

  const handleClose = (e) => {
    setToggle(null);
    e.preventDefault();
  }

  return (
    <form className="ui absolute center container">
      <label>
        Label<span className="redText">* </span>
        <input type="text"
          placeholder="any unicode characters"
          name="text"
          value={values.text}
          onChange={handleChange}
          required
        />
      </label><br/>
      <InputFormScale
        scales={scales.x}
        label="X Scale"
        name="xScale"
        value={values.xScale}
        onChange={handleChange}
      /><br/>
      <InputFormScale
        scales={scales.y}
        label="Y Scale"
        name="yScale"
        value={values.yScale}
        onChange={handleChange}
      /><br/>
      <label>
        Time Start<span className="redText">* </span>
        <input type="text"
          placeholder="#s, dates, logical operators"
          name="start"
          value={values.start}
          onChange={handleChange}
          required
        />
      </label><br/>
      <label>
        Time End<span className="redText">* </span>
        <input type="text"
          placeholder="#s, dates, logical operators"
          name="end"
          value={values.end}
          onChange={handleChange}
          required
        />
      </label><br/>
      {/*<label>
        Y Start
        <input
          type="text"
          name="yStart"
          placeholder="#s, dates, logical operators"
          value={values.yStart}
          onChange={handleChange}
        />
      </label><br/>
      <label>
        Y End
        <input
          type="text"
          name="yEnd"
          placeholder="#s, dates, logical operators"
          value={values.yEnd}
          onChange={handleChange}
        />
      </label><br/>*/}
      <label>
        Color
        <input
          type="text"
          name="color"
          placeholder="blue, #4DA6FF, etc."
          value={values.color}
          onChange={handleChange}
        />
      </label><br/>
      <label>
        Opacity
        <input
          type="number"
          placeholder="0 (transparent) - 1 (opaque)"
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
};

export default NewZoneForm;
