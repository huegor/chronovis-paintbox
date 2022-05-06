import React, { useState } from 'react';

/*
  For saving and downloading JSON data onto computer.
*/

function ExportDataForm({src, setSrc, zones, scales, data, activeData, setToggle, fileName}) {
  const [name, setName] = useState(fileName);

  const handleSave = (e) => {
    e.preventDefault();
    //syncs changes in nodes data with src
    const newSrc = {...src};
    newSrc.instants[activeData] = data; //TODO: update src every time change activeData
    newSrc.zones = zones;
    newSrc.scales = scales;
    setSrc(newSrc);
    
    //saves synced src as a file
    const fileData = JSON.stringify(newSrc);
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${name}.json`;
    link.href = url;
    link.click();
  };

  const handleClose = (e) => {
    e.preventDefault();
    setToggle(null);

  }

  return (
    <form className="ui absolute center" onSubmit={handleSave}>
      <button className="right" onClick={handleClose}>x</button><br/>
      <label>
        File Name <span className="redText">* </span>:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label><br/><br/>
      <input type="submit" value="Save Data"/>
    </form>
  );
}

export default ExportDataForm;
