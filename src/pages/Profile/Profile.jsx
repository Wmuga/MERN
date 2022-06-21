import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetch_user } from '../../API/users'
import LoadPlaceholder from '../../UI/LoadPlaceholder/LoadPlaceholder'
import {AccessControllerRedirect} from '../../utils/AccessControllet'

const Profile = () =>{
  let {userId} = useParams()
  
  let [loadedUser, setLoadedUser] = useState({})
  let [load, setLoad] = useState({
    user:true,
    userItems:true
  })
  
  if (load.user){
    fetch_user(userId,(value)=>{
      setLoadedUser(value)
      setLoad({...load,user:false})
    })
  }

  return load.user
  ? (<LoadPlaceholder/>) 
  : Object.keys(loadedUser).length ?(
    <div>
      <AccessControllerRedirect redirect='/login'accessProvider={()=>{return false}}/>
      <h2>Профиль</h2>
      <span id="nick">{loadedUser.username}</span>
      <div id="profilePic">
        <img src="Пикча" alt="User profile" /><br />
        <form action="/uploadPic" encType="multipart/form-data" method="POST">
          <label>Фото профиля <input name="img" id="img" type="file" accept="image/png, image/jpeg" /></label>
          <input type="submit" name="updatePic" value="Обновить фото профиля" />
        </form>
      </div>
      <span id="level">Пользователь</span>
      {/* Логика на рендер вакансий и резюме */}
     
      {
        !load.userItems 
        ? <LoadPlaceholder/>
        : <h2>Хуйня</h2>
      }

    </div>
  ) : (
    <AccessControllerRedirect redirect='/' accessProvider={()=>{return false}}/>
  )
}

export default Profile