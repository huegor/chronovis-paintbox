import React, { useState } from 'react';
import InputFormScale from './InputFormScale';
import InputFormText from './InputFormText';
import InputFormNum from './InputFormNum';

/*
   UI and function for adding new zones.
*/

function EditScaleForm({scales, updateSrc, setToggle, activeScale, setActiveScale}) {
  const xScale = scales.x[activeScale[0]];
  const yScale = scales.y[activeScale[1]];

  const [values, setValues] = useState({
    //for x scale
    xSelect:activeScale[0],
    xMin:xScale.min,
    xMax:xScale.max,
    xUnits:xScale.units,
    xYPos:xScale.yPos,
    xTickValues:xScale.tickValues,
    xHideUnits:xScale.hideUnits,
    xSegmentsNum:xScale.segments.length,
    //for y scale
    ySelect:activeScale[1],
    yMin:yScale.min,
    yMax:yScale.max,
    yUnits:yScale.units,
    yPercent:yScale.percent,
    yHideUnits:yScale.hideUnits
  });


  //go thru list of scales in ChronoJSON and create a selection entry for each
  // const scalesList = Object.keys(scales.x).map((key, i) => {
  //   return <option value={key} key={i}>{key}</option>
  // });
  // const [min, setMin] = useState();
  // const [max, setMax] = useState();
  // const [units, setUnits] = useState();
  // const [yPos, setYPos] = useState();
  // //optional parameters
  // const [segmentsNum, setSegmentNum] = useState([]);

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
    //setHistory
    const newScales = {...scales};
    //update existing scale
    newScales.x[values.xSelect] = {
      "min": parseFloat(values.xMin),
      "max": parseFloat(values.xMax),
      "units": values.xUnits,
      "yPos": parseFloat(values.xYPos),
      "segments": [] //todo
    }

    newScales.y[values.ySelect] = {
      "min": parseFloat(values.yMin),
      "max": parseFloat(values.yMax),
      "units": values.yUnits,
      ...(values.yPercent && {"percent": values.yPercent})
    }

    updateSrc(newScales, "scales");
    setActiveScale([values.xSelect, values.ySelect]); //move to updateSrc
    setToggle(null);
    e.preventDefault();
  };

  const handleClose = (e) => {
    setToggle(null);
    e.preventDefault();
  }

  return (
    <form className="ui absolute center container">
      <InputFormScale
        scales={scales.x}
        label="X Scale"
        name="xSelect"
        value={values.xSelect}
        onChange={handleChange}
      />
      <InputFormNum
        label="Minimum Value"
        name="xMin"
        placeholder="#s for now"
        value={values.xMin}
        handleChange={handleChange}
        required={true}
      />
      <InputFormNum
        label="Maximum Value"
        name="xMax"
        placeholder="#s for now"
        value={values.xMax}
        handleChange={handleChange}
        required={true}
      />
      <InputFormText
        label="Units Label"
        name="xUnits"
        placeholder="ie: Years"
        value={values.xUnits}
        handleChange={handleChange}
        required={true}
      />
      <label className="textSecondary">
        Screen Position<span className="redText">* </span>
        <input
          type="text"
          placeholder="0 (top) - 1 (bottom)"
          name="xYPos"
          value={values.xYPos}
          onChange={handleChange}
          required
        />
      </label>
      <label className="textSecondary">
        Segments
        <input
          type="number"
          placeholder="granularities within scale"
          name="xSegmentsNum"
          value={values.xSegmentsNum}
          onChange={handleChange}
        />
      </label><br/>
      <InputFormScale
        scales={scales.y}
        label="Y Scale"
        name="ySelect"
        value={values.ySelect}
        onChange={handleChange}
      />
      <label className="textSecondary">
        Minimum Value<span className="redText">* </span>
        <input type="text"
          placeholder="#s for now"
          name="yMin"
          value={values.yMin}
          onChange={handleChange}
          required
        />
      </label>
      <label className="textSecondary">
        Maximum Value<span className="redText">* </span>
        <input type="text"
          placeholder="#s for now"
          name="yMax"
          value={values.yMax}
          onChange={handleChange}
          required
        />
      </label>
      <label className="textSecondary">
        Units Label<span className="redText">* </span>
        <input type="text"
          placeholder="ie: Years"
          name="yUnits"
          value={values.yUnits}
          onChange={handleChange}
          required
        />
      </label><br/>
      <div className="flexCenter">
        <button className="buttonSecondary" onClick={handleClose}>Cancel</button> &nbsp;
        <button className="buttonSecondary" onClick={handleSubmit}>Submit</button>
      </div>
    </form>
  )
};

export default EditScaleForm;
