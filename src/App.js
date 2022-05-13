import React, { useState } from 'react';
import './stylesheets/index.scss';

/// Component Imports ///
import Graphic from "./components/Graphic";
import Image from "./components/Image";
import NewInstantForm from "./components/NewInstantForm";
import NewIntervalForm from "./components/NewIntervalForm";
import NewZoneForm from "./components/NewZoneForm";
import NewScaleForm from "./components/NewScaleForm";
import EditScaleForm from "./components/EditScaleForm";
import InfoBox from "./components/InfoBox";
import ExportDataForm from "./components/ExportDataForm";
import ImportDataForm from "./components/ImportDataForm";
import NavBar from "./components/NavBar";
import Layers from "./components/Layers";
import Scrubber from "./components/Scrubber";
import Legend from "./components/Legend";
import Certainty from "./components/Certainty";
import Importance from "./components/Importance";
import Connection from "./components/Connection";
import WelcomeMessage from "./components/WelcomeMessage";
import generateIntervals from "./components/generateIntervals";
import EmptyProj from "./components/EmptyProj";
import DataLibrary from "./components/DataLibrary";

/// Data Imports ///
import Data from "./data.json";
import NullData from "./NullData.json";
import LifeImportanceData from "./life_by_importance.json"
import TagVisData from "./tagVis.json";
import WaitingForBusData from "./waiting_for_bus.json"

//for installation
// import Hands from './components/Hands';


function translateData({data, nullData}) {
  const newData = {...nullData};
  const newInst = newData.instants[0];
  const scaleName = "calendarDate";
  const xValues = [];
  const yValues = [];
  const segments = [];
  // var key = 0;
  var segmentMin = null;

  //TODO: automated scale generation
  for (const datum of data) {
    newInst[`${datum.id}`] = {
      "x": datum.calendarDate,
      "y": datum.cy,
      "scale": [(datum.calendarDate<0)?"early":scaleName, "Order in Text"],
      // "target": [datum.targets[datum.targets.length-1]], //???
      "text": datum.innerText,
      // ...(e.target.color && {"color": e.target.color.value}), //if color is specified, create color entry in data
      // ...(e.target.radius && {"radius": e.target.radius.value}),
      // ...(e.target.opacity && {"opacity": e.target.opacity.value})
    };
    xValues.push(datum.calendarDate);
    yValues.push(datum.cy)
    // key++;
  }

  xValues.sort((a, b) => a-b); //smallest to largest
  yValues.sort((a, b) => a-b); //smallest to largest


  // //TODO: automated scale generation
  // xValues.forEach((val, i) => {
  //   if (xValues[i]+Math.abs(xValues[i])<xValues[i+1]) {
  //     segments.push({
  //       "min": segmentMin,
  //       "max":xValues[i]
  //     })
  //     segmentMin = xValues[i+1];
  //   } else if ((segments.length) && (i===xValues.length-1)){ //if there are segments and this is the last value
  //     segments.push({
  //       "min": segmentMin,
  //       "max": null
  //     })
  //   };
  // });
  // for (let i; i=0; i++) {
  //   console.log(xValues[i]+Math.abs(xValues[i])<xValues[i+1]);
  //   if (xValues[i]+Math.abs(xValues[i])<xValues[i+1]) { //if a value is less than 1/2 of the next value, create a segment
  //     // segments.push({
  //     //   "min": segmentMin,
  //     //   "max":xValues[i]
  //     // })
  //     // segmentMin = xValues[i+1];
  //   }
  // }
  newData.scales.x["early"] = {
    "min": xValues[0]-10,
    "max": xValues[0]+1000,
    "units": "Years",
    "yPos": 1,
    "hideLabel":true,
    "segments": [{max: xValues[0]}] //todo
  }

  newData.scales.x[`${scaleName}`] = {
    "min": xValues[2]-90,
    "max": xValues[xValues.length-1],
    "units": "Years",
    "yPos": 1,
    "segments": [{min:xValues[2]}] //todo
  }

  newData.scales.y["Order in Text"] = {
    "min": yValues[0],
    "max": yValues[xValues.length-1],
    "units": "paragraph"
  }


  // console.log(minX, maxX);
  // console.log(newData.scales);
  return newData;
}


// function scalesList(scales) {
//   Object.keys(scales).map((key, i) => {
//     return <option value={key} key={i}>{key}</option>
//   });
// }

function App() {

  const projects = {
    "My Life by Importance": {
      description:"A temporal model of events in my life organized by importance, as featured in the video tutorial.",
      data: LifeImportanceData
    },
    "The Anthropocene Signal Amidst the Noise": {
      description:"AKA ChronoVis: TagVis, this data was imported and formatted from the UCLAB Anthropocene Curriculum Project. Special thanks to Francesca Morini and Marian Dörk.",
      data: TagVisData
    },
    "Waiting for the bus": {
      description:`"I woke up at 7:30 am in someone else's bed today and it took me half an hour to get up. Thankfully, I won't be missing the 8:15AM bus, I thought. I tried to remember what happened last night but all I could recall was leaving the house at 9PM. Anyway, when I got to the bus stop 2 minutes before it was set to arrive, I waited and waited but it never showed up."`,
      data: WaitingForBusData
    },
  }

  const scaleData = {
    "imgs": [],
    "instants":
    [
      []
    ],
    "zones":
    [],
    "scales":
    {
      "x":{
        "Egyptian Dynasties": {
          "min": -3100,
          "max": -30,
          "units": "Years BCE",
          "yPos": 1,
          "tickValues": [],
          "segments": [
            // {"max": -2686, "label": "Early Dynastic"},
            // {"min": -2686, "max": -2181, "label": "Old Kingdom"},
            // {"min": -2181, "max": -2040, "label": "First Intermediate Period"},
            // {"min": -2040, "max": -1649, "label": "Middle Kingdom"},
            // {"min": -1649, "max": -1550, "label": "Second Intermediate Period"},
            // {"min": -1550, "max": -1077, "label": "New Kingdom"},
            // {"min": -1077, "max": -656, "label": "Third Intermediate Period"},
            // {"min": -656, "max": -332, "label": "Late Period"},
            // {"min": -332, "label": "Graeco-Roman"}
          ]
        }
      },
      "y":{
        "Place in Text": {
          "min": 3,
          "max": 11,
          "units": "paragraph"
        }
      }
    }
  };

  //for installation
  const [enabled, setEnabled] = useState(false);

  //user defined
  const radius = 4;

  //for entire project
  const [proj, setProj] = useState(false);
  const [fileName, setFileName] = useState("");

  //for the entire ChronoJSON
  // console.log(translateData({data:TagVisData,nullData:NullData}))
  // console.log(TagVisData)
  const [src, setSrc] = useState(NullData);

  //for ChronoJSON history. for undo and redo
  const [history, setHistory] = useState([]) //make fixed length array

  //--- copies of the source data. altering visual views does not necessarily change src data---//
  //for toggling the active data as used by scrubber
  const [activeData, setActiveData] = useState(0);
  //for toggling the active layer
  const [activeLayer, setActiveLayer] = useState();
  //for active tool modes
  const [activeTool, setActiveTool] = useState();

  //initialize datapoints
  const [data, setData] = useState(src.instants[activeData]);
  //links are initialized in Graphic.js
  // const [links, setLinks] = useState(generateLinks(src.instants[activeData]))
  //initialize zones
  const [zones, setZones] = useState(src.zones);
  //initialize scales
  const [scales, setScales] = useState(src.scales);

  //toggles datapoint IDs vs labels
  const [showLabel, setShowLabel] = useState(true);

  //for toggling the active scale
  const [activeScale, setActiveScale] = useState([Object.keys(scales.x)[0],Object.keys(scales.y)[0]])

  //---UI stuff---//
  //UI window toggles
  const [toggle, setToggle] = useState();
  //Navbar dropdown toggles
  const [nav, setNav] = useState();
  //UI info boxes for points, intervals, etc.
  const [info, setInfo] = useState();
  //Inflection info
  const [inflectTarget, setInflectTarget] = useState();
  //Syntactic inflections order
  const [syntacticOrder, setSyntacticOrder] = useState([null, null, null]); //[target1, target2, #]. # dictates order, switches b/w 0 and 1

  //--- functions ---//
  const updateSrc = (newData, key) => {
    setHistory([...history, {src:src, activeScale: activeScale, activeData: activeData, activeLayer: activeLayer}]); //history.length-1 is last src before this

    if (key==="import") {
      //copy & pasted from ImportDataForm

      setScales(newData.scales);
      setActiveScale([Object.keys(newData.scales.x)[0],Object.keys(newData.scales.y)[0]]);
      setActiveData(0);
      setData(newData.instants[activeData]);
      setZones(newData.zones);
      setSrc(newData);
      return;
    }

    const newSrc = src;
    //why is console.log(data) before & after the same, but new data point still shows up
    //have a function where, if incoming data greater than scale max or less than scale min, set that to scale max/min
    if (key==="zones") {
      setZones(newData);
      newSrc.zones = zones;
    } else if (key==="scales") {
      setScales(newData);
      newSrc.scales = newData;
    } else {
      setData(newData);
      newSrc.instants[activeData] = data;
    }
    console.log(history);
    setSrc(newSrc);
    setToggle(null);
  }

 const undo = () => {
   const newHistory = [...history];
   const last = newHistory.pop();
   if (newHistory.length&&(last !== undefined)) {
     console.log(newHistory.pop())
     setHistory([newHistory]);
     setActiveScale(last.activeScale);
     setActiveData(last.activeData);
     setActiveLayer(last.activeLayer);
     setSrc(last.src);
     setScales(last.src.scales);
     setData(last.src.instants[activeData]);
     setZones(last.src.zones);
   } else {
     //turn off undo button
   }
 }


  // console.log(info);
  /*
    TODO:
    - for piecewise timeline, make function that generates different graphics
  */
//
  return (
    <>
      {
        // <>
          // <Hands enabled={enabled} setEnabled={setEnabled}/>
          // <div className="fullHeight" onClick={e => console.log(e.clientX, e.clientY)} />
        // </>
      }

      {info && <InfoBox
        info={info}
        setInfo={setInfo}
        history={history} setHistory={setHistory}
        data={data} setData={setData}
        src={src} setSrc={setSrc}
        updateSrc={updateSrc}
        zones={zones}
        radius={radius}
      />}
      <NavBar
        toggle={toggle}
        setToggle={setToggle}
        nav={nav} setNav={setNav}
        data={data} showLabel={showLabel}
        setShowLabel={setShowLabel}
        hasScales={Object.keys(scales.y).length}
        fileName={fileName}
        setFileName={setFileName}
        proj={proj}
        undo={undo}
      />
      <div onClick={(e) => (toggle)?setNav(null):null}>
        {toggle === "dataLibrary" && <DataLibrary projects={projects} updateSrc={updateSrc} setToggle={setToggle}/>}
        {toggle==="scrubber" && <Scrubber activeData={activeData} setActiveData={setActiveData} src={src} setData={setData}/>}
        {toggle==="NewInstantForm" &&
          <NewInstantForm
            data={data}
            setData={setData}
            target={inflectTarget}
            setToggle={setToggle}
            scales={src.scales}
            activeScale={activeScale}
            activeData={activeData}
            history={history} setHistory={setHistory}
            updateSrc={updateSrc}
          />
        }
        {toggle==="editScale" && <EditScaleForm scales={scales} updateSrc={updateSrc} setToggle={setToggle} activeScale={activeScale} setActiveScale={setActiveScale}/>}
        {toggle==="addZone" && <NewZoneForm zones={zones} updateSrc={updateSrc} setToggle={setToggle} scales={scales} activeScale={activeScale}/>}
        {toggle==="addInterval" && <NewIntervalForm data={data} updateSrc={updateSrc} setToggle={setToggle} scales={scales} activeScale={activeScale} history={history} setHistory={setHistory}/>}
        {toggle==="addScale" && <NewScaleForm src={src} updateSrc={updateSrc} setToggle={setToggle} setActiveScale={setActiveScale}/>}
        {toggle==="save" &&
          <ExportDataForm
            src={src}
            setSrc={setSrc}
            data={data}
            zones={zones}
            scales={scales}
            activeData={activeData}
            setToggle={setToggle}
            fileName={fileName}
          />
        }
        {toggle==="legend" && <Legend/>}
        {toggle==="layers" && <Layers activeLayer={activeLayer} setActiveLayer={setActiveLayer} data={data}/>}
        {toggle==="import" &&
          <ImportDataForm
            updateSrc={updateSrc}
            setToggle={setToggle}
            setProj={setProj}
            setFileName={setFileName}
          />
        }
        {toggle==="certainty" &&
          <Certainty
            target={inflectTarget}
            setToggle={setToggle}
            data={data}
            updateSrc={updateSrc}
            zones={zones}
            setZones={setZones}
          />
        }
        {toggle==="importance" &&
          <Importance
            target={inflectTarget}
            setToggle={setToggle}
            data={data}
            setData={setData}
            zones={zones}
            setZones={setZones}
            radius={radius}
            setProj={setProj}
          />
        }
        {toggle==="connection" &&
          <Connection
            target={syntacticOrder}
            setToggle={setToggle}
            data={data}
            setData={setData}
            zones={zones}
            setZones={setZones}
          />
        }

        {
          proj ?
          <div id="main" className="container fullHeight">
            {Object.keys(scales.x).length ?
              <Graphic
                data={data}
                setData={setData}
                updateSrc={updateSrc}
                zones={zones}
                setZones={setZones}
                radius={radius}
                info={info}
                setInfo={setInfo}
                setInflectTarget={setInflectTarget}
                showLabel={showLabel}
                activeLayer={activeLayer}
                toggle={toggle}
                setToggle={setToggle}
                scales={scales}
                setScales={setScales}
                syntacticOrder={syntacticOrder}
                setSyntacticOrder={setSyntacticOrder}
                activeScale={activeScale}
              />
              : <EmptyProj toggle={toggle} setToggle={setToggle}/>
            }
            {src.imgs.length>0 && <Image urls={src.imgs}/>}
          </div> :
          <WelcomeMessage setProj={setProj} setFileName={setFileName} toggle={toggle} setToggle={setToggle}/>
        }
      </div>
    </>
  );
}

export default App;
