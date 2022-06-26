import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { delete_vacancy, fetch_vacancies_page, fetch_vacancies_pages_count } from '../../../API/vacancies'
import ListButtons from '../../../UI/ListButtons/ListButtons'
import LoadPlaceholder from '../../../UI/LoadPlaceholder/LoadPlaceholder'
import { AccessController } from '../../../utils/AccessControllet'
import { AuthContext } from '../../../utils/Auth'

const page_size = 10
const max_buttons_display = 10

const Vacancies = () =>{

  const [loads, setLoads] = useState({
    pages_count:true,
    cur_page:true
  })
  const [pages,setPages] = useState({
    total_pages:0,
    cur_page:1
  })

  const [vacancies,setPage] = useState([])

  let {user} = useContext(AuthContext)

  function updatePage(page) {
    setPages({...pages,cur_page:page})
    setLoads({...loads,cur_page:true})
  }

  function deletePost(id){
    delete_vacancy(id,(status)=>{
      if (status===200){
        setPage(vacancies.filter((el)=>el.id!==id))
      }
    })
  }

  if (loads.pages_count){
    fetch_vacancies_pages_count(page_size,(total_pages)=>{
      setLoads({...loads,pages_count:false})
      setPages({...pages,total_pages})
    })
  }

  if(loads.cur_page){
    fetch_vacancies_page(pages.cur_page,page_size,(page)=>{
      setPage(page)
      console.log(page)
      setLoads({...loads,cur_page:false})
    })
  }
  

  return (
    loads.pages_count
    ? <LoadPlaceholder/>
    : !pages.total_pages?
    <h2>Ошибка на серваке</h2>
    : <div className='Vacancies'>
        {
          loads.cur_page
          ? <LoadPlaceholder/>
          : vacancies.map((value,index)=>{
            return <div key={value._id}>
              <Link style={{textDecoration:'none', color:'black'}} to={`/vacancy/${value._id}`}>
              <h3>{index+(pages.cur_page-1)*page_size+1}. {value.title}</h3>
              </Link>
              <AccessController accessProvider={()=>user.level>=2}>
                <button onClick={()=>{deletePost(value._id)}}>delete</button>
              </AccessController>
              <AccessController accessProvider={()=>  user.level>=1}>
                <Link to={`/vacancy/${value._id}/edit`}>
                  <button>Edit</button>
                </Link>
              </AccessController>
            </div>
          })
        }
      <ListButtons max_items={max_buttons_display} total_items={pages.total_pages} cur_item={pages.cur_page} setCur={updatePage}/>
    </div>
  )
}

export default Vacancies