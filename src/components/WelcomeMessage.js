import React, { useState } from 'react';

function WelcomeMessage({setProj, setFileName, setToggle, toggle}) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setProj(true);
    setFileName(name);
  }

  return (
    <div className="fullHeight container bgSecondary" onClick={(e) => toggle?setToggle(null):null}>
      <div className="flexCenter thirdWidth">
        <h1>Hi, welcome to <br/>ChronoVis: Paintbox.</h1>
        <p className="smallTxt">By Johanna Drucker, developed by Skye Hoffman.</p>
        <p className="smallTxt">
          A no-code graphical interface for generating temporal data visualizations,
          designed by the humanities for the humanities. <a href="https://tinyurl.com/535yebj3" target="_blank">More info here.</a>
        </p><br/>
        <form className="container containerStretch flexRow" onSubmit={handleSubmit}>
          <input type="text"
            className="flexGrow2"
            placeholder="insert project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />&nbsp;&nbsp;&nbsp;
          <button className="buttonPrimary">Create Project</button>
        </form><br/>
        <div className="container flexRow">
          <button className="buttonPrimary" onClick={(e) => setToggle("import")}>Import Project</button>&nbsp;&nbsp;&nbsp;
          <button className="buttonPrimary" onClick={(e) => {e.preventDefault(); window.open("https://youtu.be/y0sMNCfgH-8")}}>
            First Time?
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeMessage;
