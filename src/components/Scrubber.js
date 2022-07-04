import React, { useState, useEffect, useRef } from 'react';
// import { select, drag, axisBottom, scalePoint } from "d3";

function Scrubber({activeData, setActiveData, src, setData}) {

  const handleClick = (e) => {
    if (e.target.id === "foward") {
      setActiveData(activeData += 1);
    } else {
      setActiveData(activeData -= 1);
    }
    setData(src.instants[activeData]);
  }

  return (
    <div className="ui absolute center">
      <button id="back" onClick={handleClick} disabled={activeData===0}>&lt;</button>
      {activeData}
      <button id="foward" onClick={handleClick} disabled={activeData===src.instants.length-1}>&gt;</button>
    </div>
  );
}

export default Scrubber;
