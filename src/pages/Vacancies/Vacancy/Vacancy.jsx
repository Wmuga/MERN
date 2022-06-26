import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { delete_vacancy, fetch_vacancy } from '../../../API/vacancies'
import LoadPlaceholder from '../../../UI/LoadPlaceholder/LoadPlaceholder'
import { AccessController } from '../../../utils/AccessControllet'
import { AuthContext } from '../../../utils/Auth'

const Vacancy = () =>{
  const {vacancyId} = useParams()
  const {user} = useContext(AuthContext)

  const [vacancy,setVacancy] = useState({
    load:true,
    data:{}
  })

  if(vacancy.load){
    fetch_vacancy(vacancyId,(data)=>{
      setVacancy({...vacancy,load:false,data})
    })
  }

  function deletePost(id){
    delete_vacancy(id,(status)=>{
      if (status===204){
        window.location.replace('/vacancy')
      }
    })
  }


  return (
    vacancy.load
    ? <LoadPlaceholder/>
    : <div>
      <h2>{vacancy?.data?.title}</h2>

      <AccessController accessProvider={()=>user?.level>=2}>
        <button onClick={()=>{deletePost(vacancy?.data?._id)}}>delete</button>
      </AccessController>
      <AccessController accessProvider={()=>  user.level>=1}>
        <Link to={`/vacancy/${vacancy?.data?._id}/edit`}>
          <button>Edit</button>
        </Link>
      </AccessController>

      <div>
        <span>{vacancy?.data?.user?.username}</span>
      </div>
      <div dangerouslySetInnerHTML={{__html:vacancy?.data?.body}}></div>
    </div>
  )
}

export default Vacancy