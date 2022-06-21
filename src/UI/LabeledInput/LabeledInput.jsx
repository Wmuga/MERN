import React from 'react'
import cl from "./LabeledInput.module.css"

const LabeledInput = ({descr,id, ...props}) =>{
  return (
    <div className={cl.labeled_input}>
      <label htmlFor={id}>{descr}</label>
      <input id={id} {...props} />
    </div>    
  )
}

export default LabeledInput