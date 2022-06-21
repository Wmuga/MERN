import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { fetch_resumes_page, fetch_resumes_pages_count } from '../../API/resumes'
import ListButtons from '../../UI/ListButtons/ListButtons'
import LoadPlaceholder from '../../UI/LoadPlaceholder/LoadPlaceholder'

const page_size = 10
const max_pages_display = 10

const Resumes = () =>{

  const [loads, setLoads] = useState({
    pages_count:true,
    cur_page:true
  })
  const [pages,setPages] = useState({
    total_pages:0,
    cur_page:1
  })

  const [resumes,setPage] = useState([])

  function updatePage(page) {
    setPages({...pages,cur_page:page})
    setLoads({...loads,cur_page:true})
  }

  if (loads.pages_count){
    fetch_resumes_pages_count(page_size,(total_pages)=>{
      setLoads({...loads,pages_count:false})
      setPages({...pages,total_pages})
    })
  }

  if(loads.cur_page){
    fetch_resumes_page(pages.cur_page,page_size,(page)=>{
      setPage(page)
      setLoads({...loads,cur_page:false})
    })
  }
  

  return (
    loads.pages_count
    ? <LoadPlaceholder/>
    : !pages.total_pages?
    <h2>Ошибка на серваке</h2>
    : <div className='Resumes'>
        {
          loads.cur_page
          ? <LoadPlaceholder/>
          : resumes.map(value=>{
            return <div key={value.id}>
              <Link style={{textDecoration:'none', color:'black'}} to={`/resume/${value.id}`}>
              <h3>{value.id}. {value.title}</h3>
              </Link>
            </div>
          })
        }
      <ListButtons max_items={max_pages_display} total_items={pages.total_pages} cur_item={pages.cur_page} setCur={updatePage}/>
    </div>
  )
}

export default Resumes