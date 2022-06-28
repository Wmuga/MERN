import React, { useContext,  useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetch_user, update_pfp } from '../../API/users'
import LoadPlaceholder from '../../UI/LoadPlaceholder/LoadPlaceholder'
import LabeledInput from '../../UI/LabeledInput/LabeledInput'
import {AccessControllerRedirect} from '../../utils/AccessControllet'
import { AuthContext } from '../../utils/Auth'
import options from "../../app_options.json"
import { randstr } from '../../utils/utils'

const Profile = () =>{
  const {userId} = useParams()
  const {user} = useContext(AuthContext)
  
  const [loadedUser, setLoadedUser] = useState({})
  const [load, setLoad] = useState({
    user:true,
    userItems:true
  })
  const [pfpFile, setPfpFile] = useState('')
  const [randombullshit,setRandombullshit] = useState(randstr(10))

  function changePfp(e){
    let file = e.target.files[0]
    setPfpFile(file)
  }

  function sendPfp(e){

    e.preventDefault()
    if (!pfpFile) return

    const formData = new FormData()
    formData.append('file',pfpFile,pfpFile.name)

    update_pfp(userId,formData,()=>{
      setRandombullshit(randstr(10))
    })
  }
  
  if (load.user){
    fetch_user(userId,(value)=>{
      console.log(value)
      setLoadedUser(value)
      setLoad({...load,user:false})
    })
  }

  return load.user
  ? (<LoadPlaceholder/>) 
  : Object.keys(loadedUser).length ?(
    <div>
      <AccessControllerRedirect redirect='/login' accessProvider={()=>{
        return user.userId===userId||user.level>1
      }}/>
      <h2>Профиль</h2>
      <span id="nick">{loadedUser.username}</span>
      <div id="profilePic">
        {/* Как обновлять картинку после отправки */}
        <img src={`${options.APIserver}/users/${loadedUser.userId}/pfp?${randombullshit}`} alt="User profile" /><br/>

        <form action="" onSubmit={sendPfp}>
          <LabeledInput type="file" id="img" name="img" descr="Фото профиля" accept="image/png, image/jpeg" onChange={changePfp}/>
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