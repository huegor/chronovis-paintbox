import React, { useState } from 'react';
import { ReactComponent as IconFile } from '../assets/icons/file.svg';
import { ReactComponent as IconInstant } from '../assets/icons/instant.svg';
import { ReactComponent as IconInterval } from '../assets/icons/interval.svg';
import { ReactComponent as IconZone } from '../assets/icons/zone.svg';
import { ReactComponent as IconMenu } from '../assets/icons/menu.svg';
import { ReactComponent as IconPan } from '../assets/icons/pan.svg';
import { ReactComponent as IconScales } from '../assets/icons/scales.svg';
import { ReactComponent as IconViews } from '../assets/icons/views.svg';
import { ReactComponent as IconConnection } from '../assets/icons/connection1.svg';
import { ReactComponent as IconCausation } from '../assets/icons/causation.svg';
import { ReactComponent as IconEdit } from '../assets/icons/edit.svg';
import EditForm from './EditForm';
//AKA the navbar, holds all the tools, settings, and whatnot on the top of the page

function EditButton({editMode}) {
  return (
    <>
      {editMode?
        <button className="buttonSecondary">submit</button>
        : <button className="editButton"><IconEdit className="editIcon"/></button>
      }
    </>
  )
}

function NavBar(props) {
  // console.log(props.hasScales)
  // const [content, props.setNav] = useState(null);
  const [iconTempObj, setIconTempObj] = useState(<IconInterval className="icon" alt="interval"/>);
  // const [name, setName] = useState(props.fileName); //TODO: add promise?
  const [editMode, setEditMode] = useState(false);

  const handleClick = (ref, e) => {
    e ? e.preventDefault(): ref.preventDefault();
    props.setNav(ref);
    if (props.toggle && props.toggle===ref) { //if user toggles tool that is already active, deactivate tool
      props.setToggle(null);
      props.setNav(null);
    } else if (ref==="newProj") {
      const confirm = window.confirm("Are you sure you want to begin a new project?")
      if (confirm) window.location.reload();
    } else if (ref==="about") {
      window.open("https://docs.google.com/document/d/1QgYcAYyawUQpgWIHhZpVytLEUvqQ3-6U/edit?usp=sharing&ouid=116007712725124035967&rtpof=true&sd=true");
    } else if (ref==="tutorial") {
      window.open("https://youtu.be/y0sMNCfgH-8");
    } else if (ref==="documentation") {
      window.open("https://github.com/huegor/chronovis-paintbox");
    } else { //otherwise, activate tool
      props.setToggle(ref);
    }
  }

  // const handleSetName = (e) => {
  //   e.preventDefault();
  //   if (editMode) {
  //     props.setFileName(name);
  //     setEditMode(false);
  //   } else {
  //     setEditMode(true);
  //   }
  // }

  //TODO: fix file name not displaying
  /*
  {name &&
    <form className="container flexRow flexCenter" onSubmit={(e) => setEditMode(true?false:true)}>
      <EditForm name="name" value={props.fileName} nullValue={"Untitled"} inputType="text" placeholder="insert file name" editMode={editMode} handleChange={(e) => props.setFileName(e.target.value)} /><br/>
      <EditButton editMode={editMode}/>
    </form>
  }
  */

  //todo: break up into components
  return (
    <>
      <nav className="container flexRow fullWidth containerSpace">
        <div className="container flexRow containerLeft">
          <div className="dropdown left">
            <button onClick={(e) => handleClick("temporalObject", e)} disabled={!props.hasScales} className={`${props.toggle==="addInstant" ? "toolActive" : ""}`} title="Temporal Objects">{iconTempObj}</button>
            {props.nav==="temporalObject" && <ul className="dropdown-content">
              <li><button onClick={(e) => {handleClick("addInterval", e); setIconTempObj(<IconInterval className="icon" alt="Interval"/>)}} title="Interval"><IconInterval alt="Interval"/>Interval</button></li>
              <li><button onClick={(e) => {handleClick("addInstant", e); setIconTempObj(<IconInstant className="icon" alt="Instant"/>)}} title="Instant"><IconInstant alt="Instant"/>Instant</button></li>
              <li><button  onClick={(e) => {handleClick("addZone", e); setIconTempObj(<IconZone className="icon" alt="Zone"/>)}} title="Zone"><IconZone alt="Zone"/>Zone</button></li>
            </ul>}
          </div>
          <div className="dropdown left">
            <button onClick={(e) => handleClick("inflections", e)} disabled={true/*!props.hasScales*/} title="Inflections"><IconConnection className="icon" alt="Cancelled"/></button>
            {props.nav==="inflections" && <ul className="dropdown-content  ">
              <li className="subheading">Semantic</li>
              <li><button onClick={(e) => handleClick("importance", e)}>Importance</button></li>
              <li><button onClick={(e) => handleClick("certainty", e)}>Certainty</button></li>
              <li><button onClick={(e) => handleClick("cancelled", e)}>Cancelled</button></li>
              <li><button onClick={(e) => handleClick("foreshadowing", e)}>Foreshadowing</button></li>
              <li className="subheading">Syntactic</li>
              <li><button onClick={(e) => handleClick("connection", e)}>Connection</button></li>
              <li><button>Causality</button></li>
            </ul>}
          </div>
          <div className="dropdown left">
            <button onClick={(e) => handleClick("scales", e)} disabled={!props.proj} title="Scales"><IconScales className="icon" alt="Scales"/></button>
            {props.nav==="scales" && <ul className="dropdown-content  ">
              <li><button onClick={(e) => handleClick("editScale", e)} disabled={!props.hasScales} title="Edit Scale">Edit Scale</button></li>
              <li><button onClick={(e) => handleClick("addScale", e)} title="Create Scale">Create Scale</button></li>
              {/*<li><button disabled={!props.hasScales} title="Expand Scale">Expand Scale</button></li>*/}
            </ul>}
          </div>
          <div className="dropdown left">
            <button className="fullWidth" onClick={(e) => handleClick("file", e)} disabled={!props.proj} title="File"><IconFile className="icon" alt="File"/></button>
            {props.nav==="file" && <ul className="dropdown-content  ">
              <li className="subheading">Edit</li>
              <li><button onClick={props.undo}>Undo (BETA)</button></li>
              <li><button onClick={(e) => handleClick("redo", e)} disabled>Redo</button></li>
              <li className="subheading">Document</li>
              <li><button onClick={(e) => handleClick("save", e)}>Save & Export</button></li>
              <li><button onClick={(e) => handleClick("import", e)}>Import Data</button></li>
              <li><button onClick={(e) => handleClick("dataLibrary", e)}>Import from Library</button></li>
              <li><button id="importImg" disabled>Import Image</button></li>
              <li><button onClick={(e) => handleClick("newProj", e)}>New Project</button></li>
            </ul>}
          </div>
        </div>
        {props.proj &&
          <form className="container flexRow flexCenter" onSubmit={(e) => {e.preventDefault(); setEditMode(editMode?false:true)}}>
            <EditForm name="name" value={props.fileName} nullValue={"Untitled"} inputType="text" placeholder="insert file name" editMode={editMode} handleChange={(e) => props.setFileName(e.target.value)} required={true}/><br/>
            <EditButton editMode={editMode}/>
          </form>
        }
        <div className="right container flexRow containerRight">
          <button className="right" onClick={(e) => handleClick("pan", e)} disabled={!props.hasScales} title="Pan"><IconPan className="icon" alt="Pan"/></button>
          <div className="dropdown right">
            <button onClick={(e) => handleClick("views", e)} disabled={true/*!props.hasScales*/} title="Views"><IconViews className="icon" alt="Views"/></button>
            {props.nav==="views" && <ul className="dropdown-content rightPos">
              <li className="subheading">Graphics</li>
              <li><button>Working Data</button></li>
              <li><button onClick={(e) => handleClick("scrubber", e)}>Scrubber</button></li>
              <li><button>Empirical/Relative Scales</button></li>
              <li><button onClick={(e) => handleClick("layers", e)}>Layers</button></li>
              <li className="subheading">UI</li>
              <li><button onClick={(e) => handleClick("showLabel", e)}>{props.showLabel ? "Show IDs" : "Show Labels"}</button></li>
              <li><button onClick={(e) => handleClick("legend", e)}>Legend</button></li>
            </ul>}
          </div>
          <div className="dropdown right">
            <button onClick={(e) => handleClick("menu", e)} title="Menu"><IconMenu className="icon" alt="Menu"/></button>
            {props.nav==="menu" && <ul className="dropdown-content rightPos">
              <li className="subheading">Settings</li>
              <li><button id="acessibility" disabled>Accessibility</button></li>
              <li><button id="theme" disabled>Theme</button></li>
              <li className="subheading">ChronoVis: Paintbox</li>
              <li><button onClick={(e) => handleClick("about", e)}>About</button></li>
              <li><button onClick={(e) => handleClick("tutorial", e)}>Tutorial</button></li>
              <li><button onClick={(e) => handleClick("documentation", e)}>Documentation</button></li>
            </ul>}
          </div>
        </div>
      </nav>
      {/*props.toggle && <div className="debugging">Currently active: {props.toggle}</div>*/}
    </>
  );
}

export default NavBar;
