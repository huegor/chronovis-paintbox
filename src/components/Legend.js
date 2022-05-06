import React from 'react';

function Legend() {
  return (
    <div className="ui absolute dropdown rightPos">
      Legend
      <ul>
        <li><span style={{backgroundColor: 'black'}}>&#8195;</span> Hank</li>
        <li><span style={{backgroundColor: 'red'}}>&#8195;</span> Peggy</li>
        <li><span style={{backgroundColor: '#4DA6FF'}}>&#8195;</span> Bobby</li>
      </ul>
    </div>
  )
}

export default Legend;
