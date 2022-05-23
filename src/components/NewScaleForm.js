import React, { useState } from 'react';
import InputFormText from './InputFormText';
import InputFormNum from './InputFormNum';

/*
   UI and function for adding new scales.
   Eventually split into 2 different components: NewXScaleForm and NewYScaleForm
*/


function NewScaleForm({src, updateSrc, setToggle, setActiveScale}) {

  //values for form, mutable by onChange
  const [values, setValues] = useState({
    //for x scale
    xName:"",
    xMin:"",
    xMax:"",
    xUnits:"",
    xYPos:"",
    xTickValues:"",
    xHideUnits:false,
    xSegmentsNum:0,
    //for y scale
    yName:"",
    yMin:"",
    yMax:"",
    yUnits:"",
    yPercent:"",
    yHideUnits:false
  });

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
    const newScales = {...src.scales};

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
    } //else if (scale name already exists) {
    //
    // };

    //generate new x scale
    newScales.x[values.xName] = {
      "min": tempxMin,
      "max": tempxMax,
      "units": values.xUnits,
      "yPos": tempYPos?tempYPos:0,
      // "hideUnits":values.xHideUnits,
      "segments": [] //todo
    }
    newScales.y[values.yName] = {
      "min": tempyMin,
      "max": tempyMax,
      "units": values.yUnits,
      ...(values.yPercent && {"percent": values.yPercent})
      // "hideUnits":values.yHideUnits,
    }

    // console.log(newScales)
    updateSrc(newScales, "scales");
    setActiveScale([values.xName, values.yName]); //move to updateSrc
    setToggle(null);
  };

  const handleClose = (e) => {
    setToggle(null);
    e.preventDefault();
  }

  /*
  <label className="textSecondary">
    Hide Label
    <input type="checkbox"
      name="xHideUnits"
      value={values.xHideUnits}
      onChange={(e) => setValues({...values, xHideUnits:e.target.checked})}
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
  */
  return (
    <form className="ui absolute center container">
      <span className="textSecondary"><b>x scale</b></span><br/>
      <InputFormText
        label="Name"
        name="xName"
        value={values.xName}
        onChange={handleChange}
        required={true}
      />
      <InputFormText
        label="Units Label"
        name="xUnits"
        placeholder="ie: Years"
        value={values.xUnits}
        onChange={handleChange}
        required={true}
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
      /><br/>
      <span className="textSecondary"><b>y scale</b></span><br/>
      <InputFormText
        label="Name"
        name="yName"
        value={values.yName}
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
      <br/>
      <div className="flexCenter">
        <button className="buttonSecondary" onClick={handleClose}>Cancel</button> &nbsp;
        <button className="buttonSecondary" onClick={handleSubmit}>Submit</button>
      </div>
    </form>
  )
};

export default NewScaleForm;
