/*
  - delete an individual instant
*/

function deleteInstant(target, data, updateSrc) {
  const newData = {...data};
  // const dataKeys = Object.entries(newData).map(([k,v]) => k);
  const dataValues = Object.entries(newData).map(([k,v]) => v);

  //comb thru data and delete all references to deleted instant
  dataValues.forEach(v => {
    if (!v.target || !v.target.includes(target[0])) {
      return;
    } else { //if v.target includes key
      if (v.target.length > 1) { //if multiple, delete only key
        v.target = v.target.filter((x) => x !== target[0]);
      } else { //if key is the only target, set to null
        v.target = null;
      }
    }
  });

  delete newData[target[0]];
  updateSrc(newData);
};

export default deleteInstant;
