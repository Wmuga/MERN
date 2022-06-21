import React from 'react'
import cl from './DropDown.module.css'

const DropDown = ({name, children}) =>{
  return (
    <div className={cl.hidden_container}>
      <span>{name}</span>
      <div className={cl.hidden}>
        {children}
      </div>
    </div>
  )
}

export default DropDown