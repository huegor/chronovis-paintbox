//after creating new project & before creating scale

function EmptyProj({setToggle, toggle}) {
  return (
    <div className="flexCenter">
      <button className="buttonPrimary" onClick={() => setToggle("dataLibrary")}>Import from Library</button> or <button className="buttonPrimary" onClick={() => setToggle("addScale")}>Create a scale</button>
    </div>
  );
}

export default EmptyProj;
