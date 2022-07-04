import React from 'react';

/*
  Layer creation and toggling.
*/

function Layers({activeLayer, setActiveLayer, data}){

  const handleClick = (e) => {
    const parent = e.target.parentNode;
    setActiveLayer(parseInt(parent.id));

    e.preventDefault();
  }

  //extract layer from each node, then put unique entries into an array and sort
  const orderedLayers = [...new Set(data.map(({layer}) => layer))].sort((a, b) => {return a-b});
  //create selection entry for all layers !== 0
  const layers = orderedLayers.filter(number => number !== 0).map((number) =>
    <li key={number} id={number}> Layer {number} <button onClick={handleClick}>Select</button></li>
  );

  return (
    <div className="ui absolute dropdown rightPos">
      Layers
      <ul>
        <li>All layers <button onClick={handleClick}>Select</button></li>
        {layers}
      </ul>
    </div>
  )
};

export default Layers;
