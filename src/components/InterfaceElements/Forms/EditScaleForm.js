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

  const handleSelectScale = (e, props) => {
    e.preventDefault();
    const newActiveScale = [...activeScale]
    const { value, name } = e.target;
    if (name==="xSelect") {
      newActiveScale[0] = value
    } else {
      newActiveScale[1] = value
    }

    setActiveScale(newActiveScale)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newScales = {...scales};

    const tempxMin = parseFloat(values.xMin);
    const tempxMax = parseFloat(values.xMax);
    const tempYPos = parseFloat(values.xYPos); //for x scale
    const tempyMin = parseFloat(values.yMin);
    const tempyMax = parseFloat(values.yMax);

    //error handling
    if (isNaN(tempxMin) || isNaN(tempxMax) || isNaN(tempyMin) || isNaN(tempyMax)) {
      alert("Make sure all required fields are filled in!");
      return;
    } else if (tempYPos>1 || tempYPos<0) {
      alert("Vertical position must be between 0 (bottom of the screen) and 1 (top of the screen).")
      return;
    } else if (tempxMin>=tempxMax) {
      alert("Minimum x Value must be less than or equal to Maximum x Value!");
      return;
    } else if (tempyMin>=tempyMax) {
      alert("Minimum y Value must be less than or equal to Maximum y Value!");
      return;
    } else if (tempYPos>1) {
      alert("Vertical Position must be between 0 (top) and 1 (bottom)!");
      return;
    }

    //update existing scale
    newScales.x[values.xSelect] = {
      "min": tempxMin,
      "max": tempxMax,
      "units": values.xUnits,
      "yPos": tempYPos,
      "segments": [...newScales.x[values.xSelect].segments] //todo
    }

    newScales.y[values.ySelect] = {
      "min": tempyMin,
      "max": tempyMax,
      "units": values.yUnits,
      ...(values.yPercent && {"percent": values.yPercent})
    }

    updateSrc(newScales, "scales");
    setActiveScale([values.xSelect, values.ySelect]); //move to updateSrc
    setToggle(null);
  };

  const handleClose = (e) => {
    setToggle(null);
    e.preventDefault();
  }

/*
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
*/
  return (
    <form className="ui absolute center container">
      <InputFormScale
        scales={scales.x}
        label="X Scale"
        name="xSelect"
        value={activeScale[0]}
        onChange={handleSelectScale}
      />
      <InputFormNum
        label="Minimum Value"
        name="xMin"
        placeholder="#s for now"
        value={values.xMin}
        onChange={handleChange}
        required={true}
      />
      <InputFormNum
        label="Maximum Value"
        name="xMax"
        placeholder="#s for now"
        value={values.xMax}
        onChange={handleChange}
        required={true}
      />
      <InputFormNum
        label="Vertical Position"
        name="xYPos"
        placeholder="0 (bottom) to 1 (top)"
        value={values.xYPos}
        onChange={handleChange}
      />
      <InputFormText
        label="Units Label"
        name="xUnits"
        placeholder="ie: Years"
        value={values.xUnits}
        onChange={handleChange}
        required={true}
      /><br/>
      <InputFormScale
        scales={scales.y}
        label="Y Scale"
        name="ySelect"
        value={values.ySelect}
        onChange={handleChange}
      />
      <InputFormNum
        label="Minimum Value"
        name="yMin"
        placeholder="#s for now"
        value={values.yMin}
        onChange={handleChange}
        required={true}
      />
      <InputFormNum
        label="Maximum Value"
        name="yMax"
        placeholder="#s for now"
        value={values.yMax}
        onChange={handleChange}
        required={true}
      />
      <InputFormText
        label="Units Label"
        name="yUnits"
        placeholder="ie: Years"
        value={values.yUnits}
        onChange={handleChange}
        required={true}
      /><br/>
      <div className="flexCenter">
        <button className="buttonSecondary" onClick={handleClose}>Cancel</button> &nbsp;
        <button className="buttonSecondary" onClick={handleSubmit}>Submit</button>
      </div>
    </form>
  )
};

export default EditScaleForm;
