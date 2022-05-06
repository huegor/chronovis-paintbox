import React, { useState } from 'react';
import SelectedDisplay from './SelectedDisplay';

function Certainty(props) {
  // console.log(props.target);

  const [input, setInput] = useState();

  //set opacity of target
  const handleSubmit = (e) => {
    e.preventDefault();

    if (props.target.start) { //zone
      const newZones = [...props.zones];
      const zone = newZones.find(n => n.id === props.target.id);
      zone.opacity = parseFloat(input)*.5;
      props.setZones(newZones);
      return;
    }

    const newInstants = [...props.data];

    if (props.target.source) { //link
      const instant = newInstants.find(n => n.id === props.target.source.id);
      instant.intervalOpacity = parseFloat(input);
    } else { //instant
      const instant = newInstants.find(n => n.id === props.target.id);
      instant.intervalOpacity = instant.opacity ? instant.opacity : 1; //don't change interval opacity
      instant.opacity = parseFloat(input);
    }
    props.updateSrc(newInstants);
  };

  const handleClose = (e) => {
    props.setToggle(null);
    e.preventDefault();
  }

  return (
    <form className="ui absolute center" onSubmit={handleSubmit}>
      <button className="right" onClick={handleClose}>x</button><br/>
      <SelectedDisplay target={props.target[1].text}/>
      <label>
        Certainty
        <input type="text"
          placeholder="0 (never) - 1 (certain)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
      </label><br/>
      <input type="submit" value="Submit"/>
    </form>
  )
}

export default Certainty;
