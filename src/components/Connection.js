import React, { useState } from 'react';

function Connection(props) {
  const handleSubmit = (e) => {
    e.preventDefault();

    /*
      - error handling: check if target[0] and target[1] exists
      - find instant w/ id of target[0] and:
        - If target[1] is:
          - instant, target[1].id
          - interval, {"x": target.x-source.x, "y": mouse pointer, "scale":"smalls"}
          - zone, {"x": 1622, "y": 12, "scale":"smalls"}
    */

    if (!props.target[0] || !props.target[0]) {
      console.log("error")
      return;
    }

    const newInstants = [...props.data];
    const instant = newInstants.find(n => n.id === props.target[0].id);
    if (props.target[1].x) { //for interval and zone
      const target = props.target[1]
      instant.connections = [{"x": target.x, "y": target.y, "scale": target.scale}, 0]
    } else { //for instants
      const instant2 = newInstants.find(n => n.id === props.target[1].id);
      instant.connections = [instant2.id, 0];
      instant2.connections = [instant.id, 1];
    }
    //
    // if (props.target.start) { //zone
    //   const newzones = [...props.zones];
    //   const zone = newzones.find(n => n.id === props.target.id);
    //   zone.importance = parseFloat(input);
    //   props.setZones(newZones);
    //   return;
    // }
    //

    //
    // if (props.target.source) { //link
    //   const instant = newInstants.find(n => n.id === props.target.source.id);
    //   instant.intervalWidth = instant.intervalWidth ? instant.intervalWidth*(1+input/2) : props.radius/3*(1+input/2); //if intervalWidth defined, multiply. otherwise, use default
    // } else { //instant
    //   const instant = newInstants.find(n => n.id === props.target.id);
    //   instant.radius = instant.radius ? instant.radius*(1+input/2) : props.radius*(1+input/2); //if radius defined, multiply. otherwise, use default radius
    // }
    props.setData(newInstants);


  };

  const handleClose = (e) => {
    props.setToggle(null);
    e.preventDefault();
  }

  return (
    <form className="ui absolute center" onSubmit={handleSubmit}>
      <button className="right" onClick={handleClose}>x</button><br/>
      <p>
        Connect<br/>
        <b>{props.target[0]?`${props.target[0].name}(${props.target[0].id})`: "None"}</b> {!props.target[2] && "<"}<br/>
        with<br/>
        <b>{props.target[1]?`${props.target[1].name}(${props.target[1].id})`: "None"}</b> {props.target[2]===1 && "<"}
      </p>
      <input type="submit" value="Submit"/>
    </form>
  )
}

export default Connection;
