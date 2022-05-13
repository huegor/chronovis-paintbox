import React, { useState, useEffect, useRef } from 'react';
import { select, scaleLinear, scaleOrdinal, axisBottom, axisLeft, linkHorizontal, format, drag, zoom, min, max, symbol, symbols } from "d3";
import useResizeObserver from "./useResizeObserver";
import generateIntervals from "./generateIntervals";

function Graphic({
  data, setData,
  updateSrc,
  activeLayer,
  zones, setZones,
  radius,
  info, setInfo,
  setInflectTarget,
  showLabel,
  toggle, setToggle,
  scales, setScales,
  syntacticOrder, setSyntacticOrder,
  activeScale
}) {

  //all data is passed down from and synced to App.js
  const activeData = Object.entries(data); //convert json to array for faster processing
  const activeZones = Object.entries(zones);
  //TODO: layers
  // const activeData = activeLayer ? Object.entries(data).filter(([k,v]) => v.layer === activeLayer) : arrayData;

  //convert scale object to array for faster processing


  //is logical operators active?
  const logic = data.length? isNaN(data[0].x): null; //TODO: refine logical operators

  //initialize reference object to pass to svg in React Dom
  const svgRef = useRef();
  //svg wrapped in div bc otherwise resize observer callback won't work
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  //hash map of y scales
  const yScales = {};

  //init scales. turn into useRef eventually
  useEffect(() => {
    if (!dimensions) return;
    const yTicks = [];

    for (let v of activeData) {
      yTicks.push(activeData.y);
    }

    Object.entries(scales.y).forEach(([k, v]) => {
      yScales[k]= {
        scale: scaleLinear()
        .domain([0, dimensions.height])
        .range([v.min, v.max]),
        drag: scaleLinear()
        .domain([-dimensions.height, dimensions.height])
        .range([-(v.max-v.min), (v.max-v.min)]),
        ticks: [...new Set(yTicks)]
      }
    });
  }, [dimensions, scales, currentZoomState, data]);

  //initialize intervals between instants
  const intervals = generateIntervals(data); //TODO: write updateIntervals function

  //initialize variables
  /*
  var xMin = min(Object.entries(data).map(([key, {x}]) => logic ? logicScale(x) : x));
  var xMax = max(Object.entries(data).map(([key, {x}]) => logic ? logicScale(x) : x));
  var yMin = min(Object.entries(data).map(([key, {y}]) => y));
  var yMax = max(Object.entries(data).map(([key, {y}]) => y));
  */

  //all d3 shennanigans goes in this hook. called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current); //"svg" is the current version of svgRef data
    //prevents crashing when useResizeObserver returns null before svg is rendered
    if (!dimensions) return;
    //removes svgs added using append()
    svg
      .selectAll(".remove")
      .remove();
    //removes
    if (!activeData.length) {
      svg
        .selectAll(".instant")
        .remove();
      svg
        .selectAll(".interval")
        .remove();
      svg
        .selectAll(".label")
        .remove();
      svg
        .selectAll(".intervalLabel")
        .remove();

    } else if (!activeZones.length) {
      svg
        .selectAll(".zones")
        .remove();
    }

    //rounding for data inputted thru paintbox interface
    function round(value, range) {
      const precision = Math.log10(range)<1 ? -(Math.floor(Math.log10(range)-1)) : 0;
      return Math.round(value*Math.pow(10, precision))/ Math.pow(10, precision)
    }


    //---scales---//

    //if time matches logical operator keyword, translate into index values, then map
    const logicScale = scaleOrdinal(["before", "now", "after"], [-1, 0, 1]).unknown(0);

    const breakpoint = 5;


    const xMin = min(activeData.map(([key, {x}]) => logic ? logicScale(x) : x));
    const xMax = max(activeData.map(([key, {x}]) => logic ? logicScale(x) : x));
    // const yMin = min(Object.entries(data).map(([key, {y}]) => y));
    // const yMax = max(Object.entries(data).map(([key, {y}]) => y));
    const yTicks = activeData.map(([,{y}]) => y);
    const yMin = scales.y[activeScale[1]].min;
    const yMax = scales.y[activeScale[1]].max;
    const rangeX = xMax-xMin; //0 is minX, 1 is maxX (reference findMinMax)
    const rangeY = yMax-yMin;


    /*
    - Allow users to specify scale. x&y min max and units label
    - for each scale, generateScale()
    */

    // function generateScales(currentScale) { //TODO: turn into dedicated scaleDrag
    //
    //   const xInverse = scaleLinear()
    //     .domain([0, dimensions.width])
    //     .range([currentScale.min, currentScale.max]) //maxRangeX-minRangeX gives section of x values displayed onscreen
    //   const xDrag = scaleLinear()
    //     .domain([-dimensions.width, dimensions.width])
    //     .range([-(currentScale.domain()[1]-currentScale.domain()[0]), (currentScale.domain()[1]-currentScale.domain()[0])]) //maxRangeX-minRangeX gives section of x values displayed onscreen
    //   const yInverse = scaleLinear()
    //     .domain([-dimensions.height, dimensions.height])
    //     .range((rangeY>breakpoint) ? [-rangeY, rangeY] : [-breakpoint*5, breakpoint*5])
    //
    //
    //   return {
    //     xInverse, xDrag, yInverse
    //   };
    // }
    const xInverse = (currentScale) => scaleLinear()
      .domain([0, dimensions.width])
      .range([currentScale.min, currentScale.max]) //maxRangeX-minRangeX gives section of x values displayed onscreen
    const xDrag = (currentScale) => scaleLinear()
      .domain([-dimensions.width, dimensions.width])
      .range([-(currentScale.domain()[1]-currentScale.domain()[0]), (currentScale.domain()[1]-currentScale.domain()[0])]) //maxRangeX-minRangeX gives section of x values displayed onscreen
    // const yInverse = scaleLinear()
    //   .domain([-dimensions.height, dimensions.height])
    //   .range((rangeY>breakpoint) ? [-rangeY, rangeY] : [-breakpoint*5, breakpoint*5])


    //scales values to screen pixels
    /*
    {
      biggie: {
        ...
        scale: generateScale()
      }
      ...
    }
    */

    /*
    xScale =
    {

  }
    */


    //TODO: fromEntries & entries not compatible with some older browsers
    const xScales = Object.fromEntries( //for every scale in scales data, generate an xScale
      Object.entries(scales.x).map(([key, thisScale]) => [
        key,
        {
          scale: scaleLinear() //scaleLinear takes domain (data values) & maps onto range (screen pixel values)
            .domain([thisScale.min, thisScale.max])
            .range([0, dimensions.width]),
          noBeginning: thisScale.min-0.1*(thisScale.max-thisScale.min),
          noEnd: thisScale.max+0.1*(thisScale.max-thisScale.min),
          hasSegments: thisScale.segments.length?true:false,
          hideLabel: thisScale.hideLabel,
          yPos: 1-thisScale.yPos,
          label: `${key} (${thisScale.units})`,
          tickValues: thisScale.tickValues?thisScale.tickValues:null,
          scaleInverse: scaleLinear() //for NewInstantForm
            .domain([0, dimensions.width])
            .range([thisScale.min, thisScale.max])
        }
      ])
    );

    const xSegments = () => {
      const segments = [];
      Object.keys(scales.x).forEach((key, i) => {
        const thisScale = scales.x[key];
        // const segments = [];
        if (!thisScale.segments.length) {
          return;
        }
        thisScale.segments.map(n => {
          const min = n.min?n.min:thisScale.min; //if segment contains a min, set that as min. otherwise, set scale min as min.
          const max = n.max?n.max:thisScale.max;
          // console.log(xScales[i].scale(min));
          segments.push({
            scale: key,
            yPos: 1-thisScale.yPos,
            proportion: (max-min)/(thisScale.max-thisScale.min),
            segment: scaleLinear()
            .domain([min, max])
            .range([xScales[key].scale(min), xScales[key].scale(max)])
          })
        })
      });
      return segments;
    }


    /*
      xScales(generateScales(scaleLinear(scale)))
      - take xScale and rescale according to transformations (newXScale)
      - update each array entry's domain with that of newXScale
    */
    //if there is a zoom transform, override each xScales.scale with adjusted scale
    if (currentZoomState) {
      Object.entries(xScales).forEach(([key,thisScale]) => {
        const newXScale = currentZoomState.rescaleX(thisScale.scale); //zoom state comes w methods for transformations
        const newMin = newXScale.domain()[0]
        const newMax = newXScale.domain()[1];

        //applies zoom transformations to scale + scaleInverse
        xScales[key].scale = newXScale;
      });


    };
    // const xScale = scaleLinear()
    //   .domain([xMin, xMax]) //scaleLinear takes domain (data values) & maps onto range (screen pixel values)
    //   .range([0, dimensions.width]);
    const yScale = scaleLinear()
      //if difference in y vaules greater than 5, resize to min and max
      // .domain((rangeY>breakpoint) ? [yMin, yMax] : [yMin-breakpoint, yMax+breakpoint])
      .domain([yMin, yMax])
      .range([dimensions.height,0]);
    //inverse scales for drag behavior
    // const xScaleInverse = scaleLinear()
    //   .domain([-dimensions.width, dimensions.width])
    //   .range([-rangeX, rangeX]); //maxRangeX-minRangeX gives section of x values displayed onscreen
    const yScaleInverse = scaleLinear()
      .domain([0, dimensions.height])
      .range([yMin, yMax])
      // .range((rangeY>breakpoint) ? [yMin, yMax] : [yMin-breakpoint, yMax+breakpoint]);
    const yScaleInverseDrag = scaleLinear()
      .domain([dimensions.height, -dimensions.height])
      .range([-rangeY, rangeY])
      // .range((rangeY>breakpoint) ? [-rangeY, rangeY] : [-breakpoint*5, breakpoint*5]);


    console.log(scales, xScales, yScale)

    if (Object.entries(zones).length) {
      svg
      .selectAll(".zones")
      .data(activeZones)
      .join("rect")
      .attr("class", "zones pointer")
      .attr("x", ([, v]) => xScales[v.scale[0]].scale(v.start))
      // .attr("x", n => generateScales(scales[n.scale]).x(n.start))
      .attr("y", ([, v]) => yScale(yMax))
      // .attr("y", ([, v]) => v.yStart ? yScale(v.yStart) : yMin-10) //TODO: if no yStart, minimum y value
      .attr("width", ([, v]) => xScales[v.scale[0]].scale(v.end) - xScales[v.scale[0]].scale(v.start))
      .attr("height", ([, v]) => {
        return (yScale(yMin))
        // if (v.yStart & v.yEnd) {
        //   return (yScale(v.yStart)-yScale(v.yEnd))
        // } else if (v.yStart) {
        //   return (yScale(v.yStart)-yScale(yMax-10))
        // } else {
        //   return (yScale(yMax-10)) //TODO: if no yStart, minimum y value
        //   // return (yScale(minMax[3])-yScale(minMax[2]))
        // }
      })
      .attr("opacity", ([k, v]) => v.opacity ? v.opacity : 0.5)
      .attr("fill", ([k, v]) => v.color ? v.color : "#999")
      .attr("stroke", "black") //TODO: stroke be different colors
      .attr("stroke-width", ([k, v]) => v.importance ? v.importance*2 : 0)
      .on("click", (e, target) => {
        if (toggle==="certainty" || toggle==="importance") { //pulls up inflection menu
          setInflectTarget(target);
        } else if (toggle!=="pan" || toggle!=="addInstant"){ //displays zone properties when clicked
          setInfo(null); //clear InfoBox
          setInfo({position: [e.x, e.y], target: target, type: "zone"});  //TODO: set info to null when clicking same zone again
        }
        e.stopPropagation();
      });
    }

    //---draw bottom axis---//

    xSegments().forEach(n => {
      //TODO: push all the axis ticks() values into an array
      // [...new Set(segments)]
      //draw from there
      const segment = axisBottom(n.segment)
      // .ticks(n.proportion<.33?5:null, "f");
      .ticks(null, "f")
      .tickSize(-dimensions.height); //TODO

      svg
        .append("g")
        .attr("class", "remove")
        .style("transform", `translateY(${dimensions.height*n.yPos}px)`)
        .call(segment)
        .raise()
        .call(g => g.select(".domain") //removes solid black axis bar
          .remove())
        .call(g => g.selectAll(".tick line") //styles individual ticks
          .attr("stroke-opacity", 0.25))
        .call(g => g.selectAll(".tick text")
          .attr("y", 10)
          .attr("opacity", (d, i) => { //TODO: remove instead of setting opacity to 0
            if ((n.proportion<.25)&&(i%3)) { //less than 1/4, label every 3 ticks
              return 0;
            } else if ((n.proportion<.33)&&(i%2)) { //less than 1/3, label every other tick
              return 0;
            } else {
              return 0.5
            }
          })
        );
    });

    Object.entries(xScales).forEach(([key,thisScale]) => {
      const xAxis = axisBottom(thisScale.scale)
      .tickValues(thisScale.scale.ticks().concat(scales.x[key].min, scales.x[key].max)) //pass in autogenerated tick values + min and max values
      .tickFormat(format(''))
      .tickSize(-dimensions.height);
      // console.log(thisScale.scale.ticks())

      if (!thisScale.hasSegments) {
        svg
          .append("g")
          .attr("class", "remove")
          .style("transform", `translateY(${dimensions.height*thisScale.yPos}px)`)
          .call(xAxis)
          .raise()
          .call(g => g.select(".domain") //removes solid black axis bar
            .remove())
          .call(g => g.selectAll(".tick line") //styles individual ticks
            .attr("stroke-opacity", 0.25))
          .call(g => g.selectAll(".tick text")
            .attr("y", 10) //TODO: dynamic tick text spacing for accessibility
            .attr("opacity", 0.5));
      }
      if (!thisScale.hideLabel) {
        svg
          .append("text")
          .text(thisScale.label)
          .attr("class", "axisLabel smallTxt remove")
          .attr("x", dimensions.width/2)
          .attr("y", dimensions.height*(thisScale.yPos+.07))
          .attr("text-anchor", "middle")
          .attr("opacity", 0.5);
        }
      }
    );

    //--draw vertical axis--//

    const yAxis = axisLeft(yScale)
    .tickValues([...new Set(yTicks), scales.y[activeScale[1]].min, scales.y[activeScale[1]].max]) //reg mode
    .tickFormat(format(''))

    svg
      .append("g")
      .attr("class", "remove")
      // .style("transform", `translateY(${dimensions.height*thisScale.yPos}px)`)
      .call(yAxis)
      .raise()
      .call(g => g.select(".domain") //removes solid black axis bar
        .remove())
      .call(g => g.selectAll(".tick line") //styles individual ticks
        .attr("stroke-opacity", 0.5))
      .call(g => g.selectAll(".tick text")
        .attr("y", 10) //TODO: dynamic tick text spacing for accessibility
        .attr("opacity", 0.5));

    if (!scales.y[activeScale[1]].hideLabels) {
      svg
        .append("text")
        .text(`${activeScale[1]} (${scales.y[activeScale[1]].units})`)
        .attr("class", "axisLabel smallTxt remove")
        // .attr("x", dimensions.width/2)
        // .attr("y", dimensions.height/2)
        .attr("text-anchor", "middle")
        .attr("transform", `translate(-30,${dimensions.height/2})rotate(-90)`)
        .attr("opacity", 0.5);
    }

    //--drag behavior--//
    const dragged = drag()
      // .on("start", e => {
      //   select(this).attr("stroke", "black");
      // })
      .on("drag", e => {
        //TODO: extract precision function to round new pos
        const dx = xDrag(xScales[e.subject[1].scale[0]].scale)(e.dx);
        // const dx = xScales.scaleInverse
        const dy = yScaleInverseDrag(e.dy);
        const newInstants = {...data}; //always make a copy when updating array

        //find array element in data with matching ID and set new x y coordinates
        newInstants[e.subject[0]].x += dx;
        newInstants[e.subject[0]].y += dy;

        setData(newInstants);
      }) //TODO: unify onEnd and onClick
      .on("end", e => {
        console.log("end");
      });

    if (activeData.length) {
      //---draw intervals---//
      const intervaler = linkHorizontal()
        .source(interval => interval.source[1])
        .target(interval => interval.target[1])
        // .x(n => generateScales(scales[n.scale]).x(logic ? logicScale(n.x) : n.x))
        .x(v => {
            const thisScale = xScales[v.scale[0]]
            if (!isNaN(v.x)) {
              return thisScale.scale(v.x)
            } else if (v.x==="noEnd") {
              return thisScale.scale(thisScale.noEnd)
            } else if (v.x==="noBeginning") {
              return thisScale.scale(thisScale.noBeginning)
            }
        })
        .y(v => yScale(v.y));

      svg
        .selectAll(".interval")
        .data(intervals)
        .join("path")
        .raise()
        .attr("class", "interval pointer")
        .attr("d", intervaler)
        .attr("fill", "none")
        .attr("stroke", n => n.color? n.color : "black")
        .attr("stroke-width", n => n.width ? n.width : radius)
        .attr("stroke-opacity", n => n.opacity ? n.opacity : 1)
        .attr("stroke-dasharray", n => n.dashed ? n.dashed : null)
        .on("click", (e, target) => {
          if (toggle==="connection") {
            const newOrder = [...syntacticOrder];
            if (newOrder[2]===0) { //set 2nd selection
              newOrder[1] = {x:xInverse(scales.x[activeScale[0]])(e.layerX), y:yScaleInverse(e.layerY), scale:activeScale}; //scale TODO
              newOrder[2] = 1;
            } else { //set 1st selection
              newOrder[0] = {x:xInverse(scales.x[activeScale[0]])(e.layerX), y:yScaleInverse(e.layerY), scale:activeScale};
              newOrder[2] = 0;
            }
            setSyntacticOrder(newOrder);
          }
          //else if (toggle==="foreshadowing") {
          //   if (!target.target) { //if target is an endpoint, indeterminate end
          //
          //
          //   } else { //otherwise, change mouse to no symbol
          //
          //   }
          //   //option to adjust gradient eventually
          // } else
          else if (toggle==="certainty" || toggle==="importance") {
            setInflectTarget(target);
          } else {
            setInfo(null); //clear InfoBox
            setInfo({position: [e.x, e.y], target: target, type: "interval"}); //displays interval properties when clicked
          }
          e.stopPropagation();
        });



      //---draw instants---//
      svg
        .selectAll(".instant")
        // .data(activeData.filter(d => !d.foreshadowing && !d.cancelled))
        .data(activeData)
        .join("circle")
        .raise()
        .attr("class", "instant pointer")
        .attr("r", ([,v]) => v.radius? v.radius : radius) //TODO: custom radius accessibility
        .attr("fill", ([,v]) => v.color ? v.color : "black") //if it has a color other than black, use that
        .attr("opacity", ([,v]) => v.opacity ? v.opacity : 1)
        // .attr("cx", d => generateScales(scales[d.scale]).x(logic ? logicScale(d.x) : d.x))
        .attr("cx", ([,v]) => {
          const thisScale = xScales[v.scale[0]];
          /*
          noBeginning: thisScale.min-10,
          noEnd: thisScale.max+10,
          */
          if (!isNaN(v.x)) {
            return thisScale.scale(v.x)
          } else if (v.x==="noBeginning"){
            return thisScale.scale(thisScale.noBeginning)
          } else if (v.x==="noEnd") {
            return thisScale.scale(thisScale.noEnd)
          }
        }) //scale x coordinate based on xScale defined in instant's scale property
        .attr("cy", ([,v]) => yScale(v.y))
        .call(dragged)
        .on("click", (e, target) => {
          switch (toggle) {
            case "cancelled":
              const newData = {...data};
              newData[target[0]].cancelled = true;
              // console.log(newData[target[0]]);
              updateSrc(newData);
              break;
            case "connection":
              const newOrder = [...syntacticOrder];
              if (newOrder[2]===0) { //set 2nd selection
                newOrder[1] = target;
                newOrder[2] = 1;
              } else { //set 1st selection
                newOrder[0] = target;
                newOrder[2] = 0;
              }
              setSyntacticOrder(newOrder);
              break;
            case "foreshadowing":
              if (!target.target) { //if target is an endpoint, indeterminate end
                const newInstants = [...data];
                const instant = newInstants.find(n => n.id === target.id);
                instant.foreshadowing = true;
                setData(newInstants);
              } else { //otherwise, change mouse to no symbol
                console.log("forbidden");
              }
              break;
            case "certainty":
              setInflectTarget(target);
              break;
            case "importance":
              setInflectTarget(target);
              break;
            default:
              setInfo(null); //clear InfoBox
              setInfo({position: [e.x, e.y], target: target}); //displays instant properties when clicked
          }
          // if (toggle==="cancelled") {
          //   const newInstants = [...data];
          //   const instant = newInstants.find(n => n.id === target.id);
          //   instant.cancelled = true;
          //   setData(newInstants);
          // } else if (){
          //
          // } else if (toggle==="connection") {
          //   const newOrder = [...syntacticOrder];
          //   if (newOrder[2]===0) { //set 2nd selection
          //     newOrder[1] = target;
          //     newOrder[2] = 1;
          //   } else { //set 1st selection
          //     newOrder[0] = target;
          //     newOrder[2] = 0;
          //   }
          //   setSyntacticOrder(newOrder);
          // } else if (toggle==="foreshadowing") { //todo: adjust gradient
          //   if (!target.target) { //if target is an endpoint, indeterminate end
          //     const newInstants = [...data];
          //     const instant = newInstants.find(n => n.id === target.id);
          //     instant.foreshadowing = true;
          //     setData(newInstants);
          //   } else { //otherwise, change mouse to no symbol
          //     console.log("forbidden");
          //   }
          // } else if (toggle==="certainty" || toggle==="importance"){
          //   setInflectTarget(target);
          // } else {
          //   setInfo({position: [e.x, e.y], target: target}); //displays instant properties when clicked
          // }
          e.stopPropagation(); //stops deselect when bg is clicked
        });

      /*//---draw inflections---//

      //--draw connetion inflection--//
      //circle around instant
      svg
        .selectAll(".connections")
        .data(activeData.filter(d => d.connections))
        .join("circle")
        .raise()
        .attr("class", "connections pointer")
        .attr("r", n => n.radius? n.radius*1.5 : radius*2) //TODO: custom radius accessibility
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-dasharray", "3")
        // .attr("opacity", d => d.opacity ? d.opacity : 1)
        .attr("cx", d => xScales[d.scale].scale(d.x)) //scale x coordinate based on xScale defined in instant's scale property
        .attr("cy", d => yScale(d.y));

      //link connecting circles
      const ctLinker = linkHorizontal()
        .source(instant => data.find(x => x.id === instant.id))
        .target(instant => typeof(instant.connections[0])==="object" ? instant.connections[0] : data.find(x => x.id === instant.connections[0]))
        // .target(() => {
        //   //layerX, layerY
        //   const y = yScaleInverse(499);
        //   const x = xScales.find(n => n.text === "biggie").scaleInverse(778)
        //   return {x: x, y: y}
        // })
        // .target(instant => data.find(x => x.id === instant.connections[0]))
        .x(d => d.scale ? xScales[d.scale].scale(d.x) : d.x)
        .y(d => d.scale ? yScale(d.y) : d.y);
      svg
        .selectAll(".connectionLinks")
        .data(activeData.filter(n => n.connections && !n.connections[1])) //link starts from 1st one
        .join("path")
        .raise()
        .attr("class", "connectionLinks pointer")
        .attr("d", ctLinker)
        .attr("fill", "none")
        .attr("stroke", "black")
        // .attr("stroke", n => n.color? n.color : "black")
        // .attr("stroke-opacity", n => n.opacity ? n.opacity : 1)
        .attr("stroke-dasharray", "3")
*/
      //initialize custom symbols
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
      };
      /*
      //foreshadowing symbol
      const fsSymbol = {
        draw: (context, size) => {
          let s = size;
              context.moveTo(0,0);
              context.lineTo(s*2,s/2);
              context.lineTo(s*2,-s/2);
              context.closePath();
        }
      };
      //foreshadowing gradient
      var fsg = svg.append("defs").append("linearGradient")
      .attr("id", "fsgradient")//id of the gradient
      .attr("x1", "0%")
      .attr("x2", "100%") //since its a horizontal linear gradient
      .attr("y1", "0%")
      .attr("y2", "0%");

      fsg.append("stop")
      .attr("offset", "0%")
      .style("stop-color", "black")//start in black. TODO: different color foreshadowing
      .style("stop-opacity", 1);

      fsg.append("stop")
      .attr("offset", "100%")
      .style("stop-color", "black")//end in transparent
      .style("stop-opacity", 0);
*/
      //---draw symbols---//
      //TODO: doesn't display if cancelled is true from the start
      // .attr("cx", ([,v]) => xScales[v.scale[0]].scale(v.x)) //scale x coordinate based on xScale defined in instant's scale property
      // .attr("cy", ([,v]) => yScale(v.y))
      svg
        .selectAll(".cancelled")
        .data(activeData.filter(([,v]) => v.cancelled))
        .join("path")
        .raise()
        .attr("class", "cancelled pointer")
        .attr("d", symbol(cancelledSymbol, radius*radius*5))
        .attr("fill", ([,v]) => v.color ? v.color : "black") //if it has a color other than black, use that
        .attr("transform", ([,v]) => `translate(${xScales[v.scale[0]].scale(v.x)}, ${yScale(v.y)})`)
        .on("click", (e, target) => {
          if (toggle==="cancelled") {
            const newData = {...data};
            newData[target[0]].cancelled = false;
            updateSrc(newData);
          } else {
            setInfo({position: [e.x, e.y], target: target}); //displays instant properties when clicked
          }
          e.stopPropagation();
        });
/*
      //---draw foreshadowing---//
      svg
        .selectAll(".foreshadowing")
        .data(activeData.filter(d => d.foreshadowing))
        .join("path")
        .raise()
        .attr("class", "foreshadowing pointer")
        .attr("d", symbol(fsSymbol, radius*radius*5))
        .style("fill", "url(#fsgradient)")
        .attr("transform", d => `translate(${xScales[d.scale].scale(d.x)}, ${yScale(d.y)})`)
        .on("click", (e, target) => {
          if (toggle==="foreshadowing") {
            const newInstants = [...data];
            const instant = newInstants.find(n => n.id === target.id);
            delete instant.foreshadowing;
            setData(newInstants);
          } else {
            setInfo({position: [e.x, e.y], target: target}); //displays instant properties when clicked
          }
          setToggle(null);
          e.stopPropagation();
        });
*/
      //---draw labels---//
      // svg
      //   .selectAll(".zoneLabel")
      //   .data(zones)
      //   .join("text")
      //   .attr("class", "zoneLabel")
      //   .text(v => v.text)
      //   .attr("x", v => xScales[v.scale].scale(v.start))
      //   .attr("y", v => yScale(v.yStart?v.yStart:yMin+5))
      //   .attr("text-anchor", "middle");

      svg
        .selectAll(".label")
        .data(activeData.filter(([,v]) => !isNaN(v.x)))
        .join("text")
        .attr("class", "label")
        .text(([k,v]) => showLabel ? v.text : v.id)
        .attr("x", ([k,v]) => xScales[v.scale[0]].scale(v.x))
        .attr("y", ([k,v]) => yScale(v.y-0.05*rangeY)) //vertical offset. see scales
        .attr("text-anchor", "middle");
        // .attr("font-size", fontSize);

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

    }



    //---zoom---//
    const zoomBehavior = zoom()
      .scaleExtent([1, 5]) //can zoom 2x smaller and 5x bigger
      .translateExtent([[-50, 0], [dimensions.width+50, dimensions.height]]) //limits how far graph can pan
      .on("zoom", e => {
        const zoomState = e.transform; //returns zoom transformations as an object
        setCurrentZoomState(zoomState);
      });

    //regular clicking
    svg.on("click", (e) => {
      if (toggle==="addInstant") {
        /*
        if range of zoom > 10, Math.round(x)
        if range of zoom <= 10 (floor: 10^0, ceiling: 10^1), use tenths (/10 -> /10^1)
        if range of zoom <= 1 (floor: 10^-1, ceiling: 10^0), use hudredths (/100 -> (10^2))
        if range of zoom <= .1 (floor: 10^-2, ceiling: 10^-1), use thousandths (/1000 -> (10^-3), etc.
        const decimal = scales[activeScale]
        xScales[key].scale
        const decimal = scales[activeScale]
        */
        //TODO: zoom range matches up with current zoom
        const zoomRange = xScales[activeScale[0]].scale.domain()[1] - xScales[activeScale[0]].scale.domain()[0]; //max-min
        // const precision = Math.log10(zoomRange)<1 ? -(Math.floor(Math.log10(zoomRange)-1)) : 0;
        const x = xScales[activeScale[0]].scale.invert(e.layerX);
        const y = yScale.invert(e.layerY);
        // console.log(Math.round(x*Math.pow(10, precision))/ Math.pow(10, precision));
        setInflectTarget({x: round(x, zoomRange), y: Math.round(y)});
        setToggle("NewInstantForm");
      }
      setInfo(null)
    });
    svg.call(zoomBehavior);

  }, [data, setData, zones, activeZones, scales, toggle, activeLayer, activeData, dimensions, logic, currentZoomState, setInfo, radius, showLabel, syntacticOrder]);

  return (
    <div ref={wrapperRef} className="svgWrapper">
      <svg id="graphic" ref={svgRef}>
      </svg>
    </div>
  );
};


export default Graphic;
