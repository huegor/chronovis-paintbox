import React, { useState } from 'react';
import SelectedDisplay from './SelectedDisplay';

function Importance(props) { //TODO: intervals, negatives, "steps"

  const [input, setInput] = useState();

  //todo: make for interval also
  const handleSubmit = (e) => {
    e.preventDefault();

    if (props.target.start) { //zone
      const newZones = [...props.Zones];
      const zone = newZones.find(n => n.id === props.target.id);
      zone.importance = parseFloat(input);
      props.setZones(newZones);
      return;
    }

    const newInstants = [...props.data];

    if (props.target.source) { //link
      const instant = newInstants.find(n => n.id === props.target.source.id);
      instant.intervalWidth = instant.intervalWidth ? instant.intervalWidth*(1+input/2) : props.radius/3*(1+input/2); //if intervalWidth defined, multiply. otherwise, use default
    } else { //instant
      const instant = newInstants.find(n => n.id === props.target.id);
      instant.radius = instant.radius ? instant.radius*(1+input/2) : props.radius*(1+input/2); //if radius defined, multiply. otherwise, use default radius
    }
    props.setData(newInstants);

  };

  const handleClose = (e) => {
    props.setToggle(null);
    e.preventDefault();
  }

  return (
    <form className="ui absolute center" onSubmit={handleSubmit}>
      <button className="right" onClick={handleClose}>x</button><br/>
      <SelectedDisplay target={props.target}/>
      <label>
        Importance
        <input type="number"
          placeholder="ints relative to 0 (+ and -)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
      </label><br/>
      <input type="submit" value="Submit"/>
    </form>
  )
}

export default Importance;
