import React, { useState } from 'react';

/*
  For saving and downloading JSON data onto computer.
*/

function ImportDataForm({setToggle, updateSrc, setFileName, setProj}) {
  const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);

	const handleChange = (e) => {
		setSelectedFile(e.target.files[0]);
		setIsSelected(true);
    e.preventDefault();
	};

	const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }
    let fileReader = new FileReader();
    fileReader.readAsText(selectedFile);
    fileReader.onload = () => {
      const newSrc = JSON.parse(fileReader.result);
      //add different cases for JSON and img
      setFileName(selectedFile.name.replace(".json", "")); //chop off .json extension from name
      // console.log(newSrc);
      updateSrc(newSrc, "import")
      // setSrc(newSrc);
      // setScales(newSrc.scales);
      // setActiveScale([Object.keys(newSrc.scales.x)[0],Object.keys(newSrc.scales.y)[0]]);
      // setActiveData(0);
      // setData(newSrc.instants[activeData]);
      // setZones(newSrc.zones);
    }
    fileReader.onerror = () => {
      console.log(fileReader.error);
    }
    setProj(true);
    setToggle(null);

	};

  const handleClose = (e) => {
    setToggle(null);
    e.preventDefault();
  }

  return (
    <form
      className="ui absolute center"
      onSubmit={handleSubmit}
    >
      <button className="right uiButton closeButton" onClick={handleClose}>x</button><br/>
      <input type="file" name="data" onChange={handleChange} /><br/>
			{isSelected ? (
				<p>
					File name: {selectedFile.name}<br/>
					File type: {selectedFile.type}<br/>
					Size: {selectedFile.size/1000} KB
				</p>
			) : (
				<p>Select a file to show details</p>
			)}
			<input className="uiButton" type="submit" value="Upload"/>
    </form>
  );
}

export default ImportDataForm;
