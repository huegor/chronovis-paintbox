import React, {useState} from 'react';

//after creating new project & before creating scale

function DataLibrary({projects, updateSrc, setToggle}) {

  const [selectedProject, setSelectedProject] = useState("");

  const handleChange = (e) => {
    setSelectedProject(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(projects[selectedProject].data)
    updateSrc(projects[selectedProject].data, "import");
    setToggle(null);
  }

  const handleClose = (e) => {
    e.preventDefault();
    setToggle(null);
  }

  return (
    <form className="ui absolute center container">
    <span className="textSecondary"><b>Temporal Models Library</b><br/>
    Some pre-constructed examples to stir the imagination.
    </span><br/>
      {
        Object.entries(projects).map(([name, proj], i) =>
          <div className="container flexRow containerLeft" key={i}>
            <input type="radio" value={name} onChange={handleChange} checked={selectedProject===name}/>
            <p>
              <b>{name}</b><br/>
              {proj.description}<br/>
            </p>
          </div>
        )
      }
      <div className="flexCenter">
        <button className="buttonSecondary" onClick={handleClose}>Cancel</button> &nbsp;
        <button className="buttonSecondary" onClick={handleSubmit}>Submit</button>
      </div>
    </form>
  );
}

export default DataLibrary;
