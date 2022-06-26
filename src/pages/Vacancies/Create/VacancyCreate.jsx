import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { create_vacancy } from '../../../API/vacancies'
import HtmlEditor from '../../../UI/HtmlEditor/HtmlEditor'
import { AccessControllerRedirect } from '../../../utils/AccessControllet'
import { AuthContext } from '../../../utils/Auth'

const VacancyCreate = () =>{
  const [vacancy,setVacancy] = useState({
    created:false,
    data:{
      title:'',
      body:''
    }
  })

  let {user} = useContext(AuthContext)


  function create(){
    if(!vacancy.data.title.length && !vacancy.data.body) return
    create_vacancy(vacancy.data,(status)=>{
      console.log(status)
      if (status===204) setVacancy({...vacancy,created:true})
      else{
        console.log('Server error')
      }
    })
  }

  return (
    <div>
      <AccessControllerRedirect redirect='/login' accessProvider={()=>{return typeof(user?.level)!='undefined'}}/>
      Заголовок:<br/>
      <input name="title" value={vacancy.data.title} onChange={(e)=>{setVacancy({...vacancy,data:{...vacancy.data,title:e.target.value}})}}/><br/>
      Содержимое:<br/>
      <HtmlEditor input={vacancy?.data?.body} onChange={(body)=>{setVacancy({...vacancy,data:{...vacancy.data,body}})}}/>
      {
        vacancy.created
        ? <Navigate to='/vacancy'/>
        :<button onClick={create}>Создать</button>
      }
    </div>
  )
}

export default VacancyCreate