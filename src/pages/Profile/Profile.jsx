import React, { useContext,  useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetch_user, update_pfp } from '../../API/users'
import LoadPlaceholder from '../../UI/LoadPlaceholder/LoadPlaceholder'
import LabeledInput from '../../UI/LabeledInput/LabeledInput'
import {AccessController, AccessControllerRedirect} from '../../utils/AccessControllet'
import { AuthContext } from '../../utils/Auth'
import options from "../../app_options.json"
import { randstr } from '../../utils/utils'
import cl from './Profile.module.css'

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
      setLoadedUser(value)
      setLoad({...load,user:false})
    })
  }

  return load.user
  ? (<LoadPlaceholder/>) 
  : Object.keys(loadedUser).length ?(
    <div className={cl.Profile}>
      <AccessControllerRedirect redirect='/login' accessProvider={()=>{
        return user.userId===userId||user.level>1
      }}/>
      <h2>Профиль</h2>
      
      <div className={cl.Data}>
        <span className={cl.nick}>{loadedUser.username}</span>

        <span id="level">{
          loadedUser.level? loadedUser.level===1 ? 'Модератор' : 'Администратор' : 'Пользователь'
        }</span>

        <img className={cl.ProfilePic} src={`${options.APIserver}/users/${loadedUser.userId}/pfp?${randombullshit}`} alt="User profile" /><br/>
      </div>
      
      <div className={cl.changeProfilePic}>
        <form action="" onSubmit={sendPfp}>
          <AccessController accessProvider={()=>user.userId===loadedUser.userId}>
            <LabeledInput type="file" id="img" name="img" descr="Фото профиля" accept="image/png, image/jpeg" onChange={changePfp}/>
            <input type="submit" name="updatePic" value="Обновить фото профиля" />
          </AccessController>
        </form>

      </div>     
      {
        !load.userItems 
        ? <LoadPlaceholder/>
        : <div id='items'>
          {
            loadedUser?.vacancies?.map((value,index)=>
              <div key={value._id} className='vacancy'>
                <Link style={{textDecoration:'none', color:'black'}} to={`/vacancy/${value._id}`}>
                <h3>Вакансия {index+1}. {value.title}</h3>
                </Link>
              </div>
            )
          }
          {
            loadedUser?.resumes?.map((value,index)=>
            <div key={value._id} className='vacancy'>
              <Link style={{textDecoration:'none', color:'black'}} to={`/vacancy/${value._id}`}>
              <h3>Резюме {index+1}. {value.title}</h3>
              </Link>
            </div>
          )
          }
          </div>
      }

    </div>
  ) : (
    <AccessControllerRedirect redirect='/' accessProvider={()=>{return false}}/>
  )
}

export default Profile