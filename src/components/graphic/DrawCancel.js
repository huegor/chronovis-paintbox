import React, { useState, useEffect, useRef } from 'react';
import { select, scaleLinear, scaleOrdinal, axisBottom, axisLeft, linkHorizontal, format, drag, zoom, min, max, symbol, symbols } from "d3";
import useResizeObserver from "../useResizeObserver";

function DrawCancel(props) {

          const cancelledSymbol = {
        draw: (context, size) => {
          let s = Math.sqrt(size)/2;
              context.moveTo(s,0);
              context.lineTo(s*2,s);
              context.lineTo(s,s*2);
              context.lineTo(0,s);
              context.lineTo(-s,s*2);
              context.lineTo(-s*2,s);
              context.lineTo(-s,0);
              context.lineTo(-s*2,-s);
              context.lineTo(-s,-s*2);
              context.lineTo(0,-s);
              context.lineTo(s,-s*2);
              context.lineTo(s*2,-s);
              context.closePath();
        }

}
return cancelledSymobol;
}

  
  export default DrawCancel;


