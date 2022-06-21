import React, { useContext } from 'react'
import { logout } from '../API/users'
import {AccessControllerRedirect} from '../utils/AccessControllet'
import { AuthContext } from '../utils/Auth'

const Logout = () =>{
  let {user,setUser} = useContext(AuthContext)
  logout()
  setUser({})
  return (
    <AccessControllerRedirect redirect='/' accessProvider={()=>user?.username?.length}/>
  )
}

export default Logout