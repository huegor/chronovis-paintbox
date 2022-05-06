import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill"; //otherwise breaks in safari and edge

/**
* A hook that defines an html dom element for ResizeObserver to watch
**/

const useResizeObserver = ref => {
  const [dimensions, setDimensions] = useState(null);
  //only access reference (aka the svg) when it's rendered
  useEffect(() => {
    const observeTarget = ref.current;
    //create new resize observer w callback that takes resize target as args
    const resizeObserver =  new ResizeObserver((entries) => {
      //contentRect is the part ResizeObserver returns that has xy dimensions
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    //cleanup function when unmount
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
