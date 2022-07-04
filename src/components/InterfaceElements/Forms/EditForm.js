import React, { useState } from 'react';

function EditForm(props) {

  return (
    props.editMode ?
      <input
        name={props.name}
        type={props.inputType}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.handleChange(e)}
        required={props.required}
      />
    : props.value ?
      <>{props.value}</>
    : <span className="textSecondary">{props.nullValue}</span>
  )
};

export default EditForm;
