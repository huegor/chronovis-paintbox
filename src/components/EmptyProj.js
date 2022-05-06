//after creating new project & before creating scale

function EmptyProj({setToggle}) {
  return (
    <div className="flexCenter">
      <button className="buttonPrimary" onClick={() => setToggle("import")}>Upload data</button> or <button className="buttonPrimary" onClick={() => setToggle("addScale")}>Create a scale</button>
    </div>
  );
}

export default EmptyProj;
