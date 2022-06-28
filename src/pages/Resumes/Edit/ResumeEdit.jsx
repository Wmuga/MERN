import React, { useContext, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { edit_resume, fetch_resume } from '../../../API/resumes'
import HtmlEditor from '../../../UI/HtmlEditor/HtmlEditor'
import LoadPlaceholder from '../../../UI/LoadPlaceholder/LoadPlaceholder'
import { AccessControllerRedirect } from '../../../utils/AccessControllet'
import { AuthContext } from '../../../utils/Auth'

const ResumeEdit = () =>{
  let {resumeId} = useParams()
  const [resume,setResume] = useState({
    load:true,
    changed:false,
    data:{}
  })

  let {user} = useContext(AuthContext)
  
  if(resume.load){
    fetch_resume(resumeId,(data)=>{
      setResume({...resume,load:false,data})
    })
  }

  function change(){
    edit_resume(resume.data,(status)=>{
      if (status===204) setResume({...resume,changed:true})
      else{
        console.log('Server error')
      }
    })
  }
  return (
    resume.load
    ? <LoadPlaceholder/>
    : <div>
      <AccessControllerRedirect redirect='/' accessProvider={()=>{return user?.level>1}}/>
      Заголовок:<br/>
      <input name="title" value={resume?.data?.title} onChange={(e)=>{setResume({...resume,data:{...resume.data,title:e.target.value}})}}/><br/>
      Содержимое:<br/>
      <HtmlEditor input={resume?.data?.body} onChange={(body)=>{setResume({...resume,data:{...resume.data,body}})}}/>
      {
        resume.changed
        ? <Navigate to='/resume'/>
        :<button onClick={change}>Изменить</button>
      }
    </div>
  )
}

export default ResumeEdit