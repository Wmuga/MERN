import React from 'react'
import { Navigate } from 'react-router-dom'

export const AccessControllerRedirect = ({accessProvider,redirect}) =>{
  return !accessProvider() ? <Navigate to={redirect} replace/> : null
}

export const AccessController = ({accessProvider, children})=>{
  if (typeof(accessProvider)=='function' && accessProvider()) return(<div className='strictAccess'>{children}</div>)
}