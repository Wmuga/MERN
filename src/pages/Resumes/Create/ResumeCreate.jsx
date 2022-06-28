import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { create_resume } from '../../../API/resumes'
import HtmlEditor from '../../../UI/HtmlEditor/HtmlEditor'
import { AccessControllerRedirect } from '../../../utils/AccessControllet'
import { AuthContext } from '../../../utils/Auth'

const ResumeCreate = () =>{
  const [resume,setresume] = useState({
    created:false,
    data:{
      title:'',
      body:''
    }
  })

  let {user} = useContext(AuthContext)


  function create(){
    if(!resume.data.title.length && !resume.data.body) return
    create_resume(resume.data,(status)=>{
      console.log(status)
      if (status===204) setresume({...resume,created:true})
      else{
        console.log('Server error')
      }
    })
  }

  return (
    <div>
      <AccessControllerRedirect redirect='/login' accessProvider={()=>{return typeof(user?.level)!='undefined'}}/>
      Заголовок:<br/>
      <input name="title" value={resume.data.title} onChange={(e)=>{setresume({...resume,data:{...resume.data,title:e.target.value}})}}/><br/>
      Содержимое:<br/>
      <HtmlEditor input={resume?.data?.body} onChange={(body)=>{setresume({...resume,data:{...resume.data,body}})}}/>
      {
        resume.created
        ? <Navigate to='/resume'/>
        :<button onClick={create}>Создать</button>
      }
    </div>
  )
}

export default ResumeCreate