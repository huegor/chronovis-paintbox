/*
  - delete an individual instant
*/

function deleteInterval(target, data, updateSrc) {
  const newData = {...data};
  const srcKey = target.source[0];
  const targetKey = target.target[0];
  const dataValues = Object.entries(newData).map(([k,v]) => v);

  //comb thru data and delete all references to deleted instant
  dataValues.forEach(v => {
    if (!v.target) {
      return;
    } else if (!v.target.includes(srcKey) && !v.target.includes(targetKey)) {
      return;
    } else { //if v.target includes key
      if (v.target.length > 1) { //if multiple, delete only key
        v.target = v.target.filter((x) => (x !== srcKey) && (x !== targetKey));
      } else { //if key is the only target, set to null
        v.target = null;
      }
    }
  });

  delete newData[srcKey];
  delete newData[targetKey];
  updateSrc(newData);
};

export default deleteInterval;
