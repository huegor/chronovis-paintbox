import React from 'react';

function SelectedDisplay(props){
  if (!props.target) { //no selection
    return <p>Selected: None</p>;
  } else if (props.target.source) { //link
    return <p>Selected: {props.target.source.name} ({props.target.source.id}) – {props.target.target.name} ({props.target.target.id})</p>;
  } else if (props.target.start) { //zone
    return <p>Selected: {props.target.name} ({props.target.start} - {props.target.end})</p>;
  } else { //instant
    return <p>Selected: {props.target.name} ({props.target.id})</p>;
  }
};

export default SelectedDisplay;
