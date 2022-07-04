import React, { useState, useEffect, useRef } from 'react';
import { select, scaleLinear, scaleOrdinal, axisBottom, axisLeft, linkHorizontal, format, drag, zoom, min, max, symbol, symbols } from "d3";
import useResizeObserver from "./useResizeObserver";

function DrawLabel(props) 

    return (
        svg
.selectAll(".label")
.data(activeData.filter(([,v]) => !isNaN(v.x)))
.join("text")
.attr("class", "label")
.text(([k,v]) => showLabel ? v.text : v.id)
.attr("x", ([k,v]) => xScales[v.scale[0]].scale(v.x))
.attr("y", ([k,v]) => yScale(v.y-0.05*rangeY)) //vertical offset. see scales
.attr("text-anchor", "middle")

svg
.selectAll(".intervalLabel")
.data(intervals)
.join("text")
.attr("class", "intervalLabel")
.text(v => v.text)
.attr("x", v => {
  const source=v.source[1];
  const target=v.target[1];
  const thisSourceScale = xScales[source.scale[0]];
  const thisTargetScale = xScales[target.scale[0]];
  if (!isNaN(source.x) && !isNaN( target.x)) {
    //scale values, then average them
    return (thisSourceScale.scale(source.x)+thisTargetScale.scale(target.x))/2
  } else if (isNaN(source.x)) { //if source is no end/beginning
    //noEnd or noBeginning?
    const s = source.x==="noBeginning"?thisSourceScale.scale(thisSourceScale.noBeginning):thisSourceScale.scale(thisSourceScale.noEnd)
    return (s+thisTargetScale.scale(target.x))/2
  } else if (isNaN(target.x)) { //if target is no end/beginning
    const s = target.x==="noBeginning"?thisTargetScale.scale(thisTargetScale.noBeginning):thisTargetScale.scale(thisTargetScale.noEnd)
    return (s+thisSourceScale.scale(source.x))/2
  }
})
.attr("y", v => yScale(Math.max(v.source[1].y, v.target[1].y)+0.05*rangeY)) //.05 above max y
.attr("text-anchor", "middle");
    )
  };
  
  export default DrawLabel;


