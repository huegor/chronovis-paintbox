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

  // //initialize reference object to pass to svg in React Dom
  // const svgRef = useRef();
  //
  // useEffect(() => {
  //   const svg = select(svgRef.current);
  //
  //   const dragged = drag()
  //     .on("drag", e => {
  //       console.log(activeData);
  //       // if ((e.dx > 0) && (activeData>src.nodes.length-1 )) {
  //       //   setActiveData(activeData += 1);
  //       // } else if (activeData<0) {
  //       //   setActiveData(activeData -= 1);
  //       // }
  //       // console.log(activeData);
  //     });
  //
  //   const scale = scalePoint()
  //     .domain(src.nodes.map((n) => src.nodes.indexOf(n)))
  //     .range([0, 300]); //todo
  //
  //   const axis = axisBottom(scale);
  //
  //   svg
  //     .select(".scrubber-axis")
  //     .style("transform", `translateY(70px)`) //todo
  //     .call(axis);
  //
  //   svg
  //     .append("circle")
  //     .attr("r", 5)
  //     .attr("cx", activeData)
  //     .attr("cy", 50)
  //     .call(dragged)
  //     .on("click", () => {setActiveData(activeData+=1)});
  //
  // }, [activeData, src]);


  // <svg ref={svgRef} className="ui absolute center">
  //   <g className="scrubber-axis" />
  // </svg>

  return (
    <div className="ui absolute center">
      <button id="back" onClick={handleClick} disabled={activeData===0}>&lt;</button>
      {activeData}
      <button id="foward" onClick={handleClick} disabled={activeData===src.instants.length-1}>&gt;</button>
    </div>
  );
}

export default Scrubber;
