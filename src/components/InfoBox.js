import deleteInstant from "./deleteInstant";
import deleteInterval from "./deleteInterval";
import EditForm from "./EditForm";
import React, { useState } from 'react';

/*
  - pass object info and mouseclick position to component
  - component is a div set at mouseclick position and displays object info as text
*/

function InfoBox({info, setInfo, history, setHistory, data, zones, updateSrc, radius}) {
  //init
  var content = null;
  const target = Array.isArray(info.target)?info.target[1]:info.target;
  //TODO
  const infoXPos = info.position[0];
  const infoYPos = info.position[1];
  /*
    - structure of instant targets:
      {
        "text": "Lorem",
        "x": 1620,
        "y": 15,
        "target": [
            "1"
        ],
        "color": "#4DA6FF",
        "opacity": 0.5,
        "radius": 8,
        "intervalText": "evolution of terrestrial vegetation",
        "intervalColor": "red",
        "intervalWidth": 5,
        "intervalOpacity": 0.8,
        "intervalDashed": "5 2",
        "layer": 1,
        "scale": "smalls"
      }
    - structure of interval targets:
      {
        "source": [
            "0",
            {
                "text": "Lorem",
                "x": 1620,
                "y": 15,
                .
                .
                .
            }
        ],
        "target": [
            "1",
            {
                "text": "Ipsum",
                "x": 1623,
                "y": 15,
                .
                .
                .
            }
        ],
        "text": "evolution of terrestrial vegetation",
        "color": "red",
        "width": 5,
        "opacity": 0.8,
        "dashed": "5 2"
      }
    - structure of zone targets:
      {
        "id": 1,
        "text": "zone2",
        "start": 1623,
        "end": 1630,
        "yStart": 10,
        "yEnd": 30,
        "color": "green",
        "opacity": 0.25,
        "scale": "smalls",
        "importance": 2
      }
  */

  //states
  const [editMode, setEditMode] = useState(false);

  //values directly from data, immutable by onChange
  const dataValues = {
    //instant specific
    time: target.x,
    yPos: target.y,
    radius: target.radius,
    //interval specific
    sourceX: target.source?target.source[1].x:null,
    sourceY: target.source?target.source[1].y:null,
    targetX: target.source?target.target[1].x:null, //target.target for both instant and interval, but target.source interval only
    targetY: target.source?target.target[1].y:null,
    //zone specific
    timeStart: target.start,
    timeEnd: target.end,
    yStart: target.yStart,
    yEnd: target.yEnd,
    //all
    text: target.text,
    color: target.color,
    opacity: target.opacity,
    width: target.width,
    importance: target.importance
  };

  //turn null values into empty string for controlled input forms
  Object.entries(dataValues).forEach((k) => {
    if (!k[1]) { //check for null value
      dataValues[k[0]] = "";
    }
  });

  //values for input forms, mutable
  const [values, setValues] = useState(dataValues);

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  const handleCancel = (e) => {
    e.preventDefault();
    //reset all values to json data version
    setValues(dataValues);
    setEditMode(false);
  }

  const handleSubmitInstant = (e) => {
    e.preventDefault();
    const newData = {...data};
    const xyArray = [values.time, values.yPos];

    //error handling
    const xyNums = xyArray.map ( n => {
        if (isNaN(parseFloat(n))) {
            alert("Please input valid times and/or Y positions!");
            return;
        } else {
          return parseFloat(n);
        }
      }
    );

    newData[info.target[0]] = {
      ...newData[info.target[0]],
      "x": xyNums[0],
      "y": xyNums[1],
      "text": values.text,
      "color": values.color, //if color is specified, create color entry in data
      "radius": values.radius,
      "opacity": values.opacity,
      "importance": values.importance
    };

    updateSrc(newData);
    setEditMode(false);
    setInfo(null);
  }

  const handleSubmitInterval = (e) => {
    e.preventDefault();
    const newData = {...data};
    const xyArray = [values.sourceX, values.sourceY, values.targetX, values.targetY];

    //error handling
    const xyNums = xyArray.map ( n => {
        if (isNaN(parseFloat(n))) {
            alert("Please input valid times and/or Y positions!");
            return;
        } else {
          return parseFloat(n);
        }
      });

    const node = newData[target.source[0]];
    node.x = xyNums[0];
    node.y = xyNums[1];
    newData[target.target[0]].x = xyNums[2];
    newData[target.target[0]].y = xyNums[3];
    node.intervalColor = values.color;
    node.intervalWidth = values.width;
    node.intervalOpacity = values.opacity;
    node.intervalText = values.text;

    updateSrc(newData);
    setEditMode(false);
    setInfo(null);
  }

  const handleSubmitZone = (e) => {
    e.preventDefault();

    const newZones = {...zones};
    const xyArray = [values.timeStart, values.timeEnd];
    // const xyArray = [values.timeStart, values.timeEnd, values.yStart, values.yEnd];

    //error handling
    const xyNums = xyArray.map ( n => {
        if (isNaN(parseFloat(n))) {
            alert("Please input valid times and/or Y positions!");
            return;
        } else {
          return parseFloat(n);
        }
    });


    newZones[info.target[0]] = {
      ...newZones[info.target[0]],
      "start": xyNums[0],
      "end": xyNums[1],
      "yStart": xyNums[2],
      "yEnd": xyNums[3],
      "text": values.text,
      "color": values.color,
      "opacity": values.opacity,
      "importance": values.importance
    };

console.log(newZones[info.target[0]]);

    updateSrc(newZones, "zones");
    setEditMode(false);
    setInfo(null);
  }

  const handleDeleteInterval = (e) => {
    e.preventDefault();
    deleteInterval(target, data, updateSrc);
    setInfo(null);
  }

  const handleDeleteInstant = (e) => {
    e.preventDefault();
    deleteInstant(info.target, data, updateSrc);
    setInfo(null);
  }

  const handleDeleteZone = (e) => {
    e.preventDefault();
    const newZones = {...zones};
    delete newZones[info.target[0]];
    //won't delete if there is only 1 zone left
    updateSrc(newZones, "zones");
    setInfo(null);
  }

  switch (info.type) {
    case 'interval':
      content =
        <form className="container">
          <div className="container flexRow">
            <div className="containerLeft textRight textSecondary">
              Text: &nbsp;<br/>
              From: &nbsp;<br/>
              To: &nbsp;<br/>
              Color: &nbsp;<br/>
              Opacity: &nbsp;<br/>
              Importance: &nbsp;<br/>
              Width: &nbsp;
            </div>
            <div className="containerRight">
              <EditForm name="text" value={values.text} nullValue={"n/a"} inputType="text" placeholder="any unicode character" editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="sourceX" value={values.sourceX} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/>,&nbsp;
              <EditForm name="sourceY" value={values.sourceY} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/><br/>
              <EditForm name="targetX" value={values.targetX} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/>,&nbsp;
              <EditForm name="targetY" value={values.targetY} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/><br/>
              <EditForm name="color" value={values.color} nullValue={"black"} inputType="text" placeholder="blue, #4DA6FF, etc." editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="opacity" value={values.opacity} nullValue={"1"} inputType="text" placeholder="0(clear) - 1(opaque)" editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="importance" value={values.importance} nullValue={"0"} inputType="text" placeholder="any integer" editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="width" value={values.width} nullValue={`${radius}`} inputType="text" placeholder="any real number" editMode={editMode} handleChange={handleChange} /><br/>
            </div>
          </div>
          <div className="flexCenter">
            {editMode ?
              <><button className="buttonSecondary" onClick={handleCancel}>Cancel</button> &nbsp;
              <button className="buttonSecondary" onClick={handleSubmitInterval}>Submit</button></>
            : <><button className="buttonSecondary" onClick={(e) => {e.preventDefault();setEditMode(true)}}>Edit</button> &nbsp;
              <button className="buttonSecondary" onClick={handleDeleteInterval}>Delete Interval</button></>
            }
          </div>
        </form>
    break
    case 'zone':
      content =
        <form className="container">
          <div className="container flexRow">
            <div className="containerLeft textRight textSecondary">
              Text: &nbsp;<br/>
              Time Start: &nbsp;<br/>
              Time End: &nbsp;<br/>
              {/*Y Start: &nbsp;<br/>
              Y End: &nbsp;<br/>*/}
              Color: &nbsp;<br/>
              Opacity: &nbsp;<br/>
              Importance: &nbsp;
            </div>
            <div className="containerRight">
              <EditForm name="text" value={values.text} nullValue={"n/a"} inputType="text" placeholder="any unicode character" editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="timeStart" value={values.timeStart} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/><br/>
              <EditForm name="timeEnd" value={values.timeEnd} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/><br/>
              {/*<EditForm name="yStart" value={values.yStart} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/><br/>
              <EditForm name="yEnd" value={values.yEnd} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/><br/>*/}
              <EditForm name="color" value={values.color} nullValue={"black"} inputType="text" placeholder="blue, #4DA6FF, etc." editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="opacity" value={values.opacity} nullValue={"1"} inputType="text" placeholder="0(clear) - 1(opaque)" editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="importance" value={values.importance} nullValue={"0"} inputType="text" placeholder="any integer" editMode={editMode} handleChange={handleChange} /><br/>
            </div>
          </div>
          <div className="flexCenter">
            {editMode ?
              <><button className="buttonSecondary" onClick={handleCancel}>Cancel</button> &nbsp;
              <button className="buttonSecondary" onClick={handleSubmitZone}>Submit</button></>
            : <><button className="buttonSecondary" onClick={(e) => {e.preventDefault();setEditMode(true)}}>Edit</button> &nbsp;
              <button className="buttonSecondary" onClick={handleDeleteZone}>Delete Zone</button></>
            }
          </div>
        </form>
    break
    default:
      content =
        <form className="container">
          <div className="container flexRow">
            <div className="containerLeft textRight textSecondary">
              Text: &nbsp;<br/>
              Time: &nbsp;<br/>
              Y Position: &nbsp;<br/>
              Color: &nbsp;<br/>
              Opacity: &nbsp;<br/>
              Radius: &nbsp;<br/>
              Importance: &nbsp;<br/>
            </div>
            <div className="containerRight">
              <EditForm name="text" value={values.text} nullValue={"n/a"} inputType="text" placeholder="any unicode character." editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="time" value={values.time} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange}/><br/>
              <EditForm name="yPos" value={values.yPos} nullValue={"n/a"} inputType="text" placeholder="numbers for now" editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="color" value={values.color} nullValue={"black"} inputType="text" placeholder="blue, #4DA6FF, etc." editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="opacity" value={values.opacity} nullValue={"1"} inputType="text" placeholder="0(clear) - 1(opaque)" editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="radius" value={values.radius} nullValue={`${radius}`} inputType="text" placeholder="any real number" editMode={editMode} handleChange={handleChange} /><br/>
              <EditForm name="importance" value={values.importance} nullValue={"0"} inputType="text" placeholder="any integer" editMode={editMode} handleChange={handleChange} /><br/>
            </div>
          </div>
          <div className="flexCenter">
            {editMode ?
              <><button className="buttonSecondary" onClick={handleCancel}>Cancel</button> &nbsp;
              <button className="buttonSecondary" onClick={handleSubmitInstant}>Submit</button></>
            : <><button className="buttonSecondary" onClick={(e) => {e.preventDefault();setEditMode(true)}}>Edit</button> &nbsp;
              <button className="buttonSecondary" onClick={handleDeleteInstant}>Delete Instant</button></>
            }
          </div>
        </form>
  };

  return (
    <div className="ui absolute" style={{left: info.position[0] + 'px', top: info.position[1] + 'px'}}>
      {content}
    </div>
  );
}

export default InfoBox;
