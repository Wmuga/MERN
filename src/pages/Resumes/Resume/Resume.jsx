import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { delete_resume, fetch_resume } from '../../../API/resumes'
import LoadPlaceholder from '../../../UI/LoadPlaceholder/LoadPlaceholder'
import { AccessController } from '../../../utils/AccessControllet'
import { AuthContext } from '../../../utils/Auth'

const Resume = () =>{
  const {resumeId} = useParams()
  const {user} = useContext(AuthContext)

  const [resume,setResume] = useState({
    load:true,
    data:{}
  })

  if(resume.load){
    fetch_resume(resumeId,(data)=>{
      setResume({...resume,load:false,data})
    })
  }

  function deletePost(id){
    delete_resume(id,(status)=>{
      if (status===204){
        window.location.replace('/resume')
      }
    })
  }


  return (
    resume.load
    ? <LoadPlaceholder/>
    : <div>
      <h2>{resume?.data?.title}</h2>

      <AccessController accessProvider={()=>user?.level>=2}>
        <button onClick={()=>{deletePost(resume?.data?._id)}}>delete</button>
      </AccessController>
      <AccessController accessProvider={()=>  user.level>=1}>
        <Link to={`/resume/${resume?.data?._id}/edit`}>
          <button>Edit</button>
        </Link>
      </AccessController>

      <div>
        <span>{resume?.data?.author?.username}</span>
      </div>
      <div dangerouslySetInnerHTML={{__html:resume?.data?.body}}></div>
    </div>
  )
}

export default Resume