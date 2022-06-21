import React from 'react'
import cl from "./LoadPlaceholder.module.css"

const LoadPlaceholder = () =>{
  return (
    <div style={{display:'flex',justifyContent:'center'}}>
      <div className={cl.Load}></div>
    </div>
  )
}

export default LoadPlaceholder