import React from 'react';
import InputFormScale from './InputFormScale';
import InputFormText from './InputFormText';
import InputFormNum from './InputFormNum';

/*
   UI and function for adding new points.
*/

class NewInstantForm extends React.Component {
  //controlled component, meaning React is the "single source of truth"
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      xValue: props.target?props.target.x:'', //"target" is scaled mouse click coordinates. Graphics.js addInstant
      yValue: props.target?props.target.y:'',
      xScale: props.activeScale[0],
      yScale: props.activeScale[1],
      color: '',
      opacity: '',
      radius: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(e) {
    console.log(e)
    const value = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: value
    });
  }

  handleClose(e) {
    this.props.setToggle(null);
    e.preventDefault();
  }

  handleSubmit(e) { //consider turning into useCallback
    e.preventDefault();
    const newData = {...this.props.data};
    const lastKey = Object.keys(newData).pop() ? parseInt(Object.keys(newData).pop()) : -1;
    const lastInstant = newData[lastKey]; //last instant of data

    const tempx = parseFloat(this.state.xValue);
    //if y pos specified, convert to float. otherwise, return null
    const tempy = this.state.yValue ? parseFloat(this.state.yValue) : null;

    //error handling. btw, isNan(null) === false
    if (isNaN(tempx) && isNaN(tempy)) {
      alert("Make sure Time and y Position are numbers!");
    } else if (isNaN(tempx)) {
      alert("Make sure Time is a number!");
    } else if (isNaN(tempy)) {
      alert("Make sure y Position is a number!");
    } else {
      //generate instant
      newData[`${lastKey+1}`] = {
        "x":tempx,
        "y": this.state.yValue ? tempy : ( lastInstant ? lastInstant.y : 0 ), // if y not specified, take value of last instant
        "scale": [this.state.xScale,this.state.yScale],
        "target": null,
        "text": this.state.label,
        ...(this.state.color && {"color": this.state.color}), //if color is specified, create color entry in data
        ...(this.state.radius && {"radius": this.state.radius}),
        ...(this.state.opacity && {"opacity": this.state.opacity})
      };
    };

    //order of parameters is important
    this.props.updateSrc(newData);

  }

  render() {

    return (
      <form className="ui absolute center container">
        <InputFormText
          label="Label"
          name="label"
          onChange={this.handleChange}
          value={this.state.label}
        />
        <InputFormScale
          scales={this.props.scales.x}
          label="X Scale"
          name="xScale"
          value={this.state.xScale}
          onChange={this.handleChange}
        />
        <InputFormNum
          label="Time"
          name="xValue"
          placeholder="numbers only for now"
          value={this.state.xValue}
          onChange={this.handleChange}
          required
        />
        <InputFormScale
          scales={this.props.scales.y}
          label="Y Scale"
          name="yScale"
          value={this.state.yScale}
          onChange={this.handleChange}
        />
        <InputFormNum
          label="Y Value"
          name="yValue"
          placeholder="numbers only for now"
          value={this.state.yValue}
          onChange={this.handleChange}
          required
        />
        <InputFormText
          label="Color"
          name="color"
          placeholder="blue, #4DA6FF, etc."
          value={this.state.color}
          onChange={this.handleChange}
        />
        <InputFormNum
          label="Certainty"
          name="opacity"
          placeholder="0 to 1 (default 1)"
          value={this.state.opacity}
          onChange={this.handleChange}
        />
        <InputFormNum
          label="Radius"
          name="radius"
          placeholder="(default 5)"
          value={this.state.radius}
          onChange={this.handleChange}
        />
        <br/>
        <div className="flexCenter">
          <button className="buttonSecondary" onClick={this.handleClose}>Cancel</button> &nbsp;
          <button className="buttonSecondary" onClick={this.handleSubmit}>Submit</button>
        </div>
      </form>
    );
  }
};

export default NewInstantForm;
