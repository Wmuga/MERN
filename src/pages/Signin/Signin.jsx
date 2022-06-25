import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { create_user } from '../../API/users'
import LabeledInput from '../../UI/LabeledInput/LabeledInput'
import {AccessControllerRedirect} from '../../utils/AccessControllet'
import { AuthContext } from '../../utils/Auth'
import './Signin.module.css'

const Signin = () =>{
  let [loginData, loginDataChange] = useState({
    login:'', password:''
  })

  let {user,setUser} = useContext(AuthContext)

  function createUser(){
    create_user(loginData.login,loginData.password,(user)=>{
      setUser(user)
    })
  }

  return (
    <form action=''>
      <AccessControllerRedirect redirect='/' accessProvider={()=>{return !user?.username?.length}} />

      <LabeledInput value={loginData.login} descr='Login:' id="login" type="text" name="login" placeholder='Login' onChange={(e)=>{loginDataChange({...loginData,login:e.target.value})}} />
      <LabeledInput value={loginData.password} descr='Password:' id="password" type="password" name="password" placeholder='Password' onChange={(e)=>{loginDataChange({...loginData,password:e.target.value})}} />
      <input type="button" value="Зарегистрироваться" onClick={createUser}/>
      <Link to="/login" className="header_href_deco button_like">Войти</Link>
    </form>
  )
}

export default Signin