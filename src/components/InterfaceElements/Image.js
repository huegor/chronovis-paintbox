const Image = (props) => {
  //will have to change css so position is defined by React
  return (
    <img src={`/library/${props.urls}`} alt="schema-1"/>
  )
};

export default Image;
