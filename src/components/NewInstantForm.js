import React from 'react';
import InputFormScale from './InputFormScale';
/*
   UI and function for adding new points.
*/

class NewInstantForm extends React.Component {
  //controlled component, meaning React is the "single source of truth"
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      xValue: props.target.x, //"target" is scaled mouse click coordinates. Graphics.js addInstant
      yValue: props.target.y,
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
        <label>
          Label
          <input type="text"
            name="label"
            placeholder="any unicode characters"
            value={this.state.label}
            onChange={this.handleChange}
          />
        </label><br/>
        <InputFormScale
          scales={this.props.scales.x}
          label="X Scale"
          name="xScale"
          value={this.state.xScale}
          onChange={this.handleChange}
        /><br/>
        <label>
          Time<span className="redText">* </span>
          <input
            type="number"
            name="xValue"
            placeholder="numbers only"
            value={this.state.xValue}
            onChange={this.handleChange}
            required
          />
        </label><br/>
        <InputFormScale
          scales={this.props.scales.y}
          label="Y Scale"
          name="yScale"
          value={this.state.yScale}
          onChange={this.handleChange}
        /><br/>
        <label>
          y Position
          <input
            type="number"
            name="yValue"
            placeholder="#s only (default 0)"
            value={this.state.yValue}
            onChange={this.handleChange}
          />
        </label><br/>
        <label>
          Color
          <input
            type="text"
            name="color"
            placeholder="blue, #4DA6FF, etc."
            value={this.state.color}
            onChange={this.handleChange}
          />
        </label><br/>
        <label>
          Opacity
          <input
            type="number"
            name="opacity"
            placeholder="1"
            value={this.state.opacity}
            onChange={this.handleChange}
          />
        </label><br/>
        <label>
          Radius
          <input
            type="number"
            name="radius"
            placeholder="5"
            value={this.state.radius}
            onChange={this.handleChange}
          />
        </label><br/>
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
