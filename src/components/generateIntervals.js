/*
   generates intervals between all intervaled instants and
   returns a interval object with interval properties.
*/

function generateIntervals(data) {
// console.log(data[8])
  /*
    expand to standalone paths? bezier curve: https://svg-path-visualizer.netlify.app/bezier-curve/
    - start: can specify point or enter coordinate values directly (run thru xScale)
    - control: ???
    - end: same as start
    output: M startX,startY C controlX1,controlY1 controlX2,controlY2 endX, endY
  */

  const intervals = []; //array of all instant intervals

  Object.entries(data).forEach((item) => {
    const key = item[0];
    const value = item[1];

    if (!value.target) {
      //if the instant does not have a target, skip generating interval
      return
    } else {
      value.target.forEach((n) => {
        const instant = [n, data[n]];
        if (instant[1]) { //does instant exist?
          intervals.push({
            source:item,
            target:instant,
            text: value.intervalText,
            color:value.intervalColor ? value.intervalColor : value.color ? value.color : null, //if not specified, use point color. otherwise, null
            width:value.intervalWidth,
            opacity:value.intervalOpacity ? value.intervalOpacity : null,
            dashed: value.intervalDashed
          });
        }
      });
    }
  });
  return intervals;
};

export default generateIntervals;
