import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { delete_vacancy, fetch_full_vacancy } from '../../../API/vacancies'
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
    fetch_full_vacancy(vacancyId,(data)=>{
      setVacancy({...vacancy,load:false,data})
    })
  }

  function deletePost(id){
    delete_vacancy(id,(status)=>{
      if (status===200){
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
        <button onClick={()=>{deletePost(vacancy?.data?.id)}}>delete</button>
      </AccessController>
      <AccessController accessProvider={()=>  user.level>=1}>
        <Link to={`/vacancy/${vacancy?.data?.id}/edit`}>
          <button>Edit</button>
        </Link>
      </AccessController>

      <div>
        {/* {JSON.stringify(vacancy?.data?.user)} */}
        <span>{vacancy?.data?.user?.username}</span>
      </div>
      <div>{vacancy?.data?.body}</div>
    </div>
  )
}

export default Vacancy