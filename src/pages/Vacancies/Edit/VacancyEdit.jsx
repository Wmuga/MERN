import React, { useContext, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { edit_vacancy, fetch_vacancy } from '../../../API/vacancies'
import HtmlEditor from '../../../UI/HtmlEditor/HtmlEditor'
import LoadPlaceholder from '../../../UI/LoadPlaceholder/LoadPlaceholder'
import { AccessControllerRedirect } from '../../../utils/AccessControllet'
import { AuthContext } from '../../../utils/Auth'

const VacancyEdit = () =>{
  let {vacancyId} = useParams()
  const [vacancy,setVacancy] = useState({
    load:true,
    changed:false,
    data:{}
  })

  let {user} = useContext(AuthContext)
  
  if(vacancy.load){
    fetch_vacancy(vacancyId,(data)=>{
      setVacancy({...vacancy,load:false,data})
    })
  }

  function change(){
    edit_vacancy(vacancy.data,(status)=>{
      if (status===200) setVacancy({...vacancy,changed:true})
      else{
        console.log('Server error')
      }
    })
  }

  return (
    vacancy.load
    ? <LoadPlaceholder/>
    : <div>
      {/* <AccessControllerRedirect redirect='/' accessProvider={()=>{return true}}/> */}
      <AccessControllerRedirect redirect='/' accessProvider={()=>{return user?.level>1}}/>
      Заголовок:<br/>
      <input name="title" value={vacancy?.data?.title} onChange={(e)=>{setVacancy({...vacancy,data:{...vacancy.data,title:e.target.value}})}}/><br/>
      Содержимое:<br/>
      <HtmlEditor input={vacancy?.data?.body} onChange={(body)=>{setVacancy({...vacancy,data:{...vacancy.data,body}})}}/>
      {
        vacancy.changed
        ? <Navigate to='/vacancy'/>
        :<button onClick={change}>Изменить</button>
      }
    </div>
  )
}

export default VacancyEdit