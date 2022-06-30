import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { delete_resume, fetch_resumes_page, fetch_resumes_pages_count } from '../../../API/resumes'
import ListButtons from '../../../UI/ListButtons/ListButtons'
import LoadPlaceholder from '../../../UI/LoadPlaceholder/LoadPlaceholder'
import { AccessController } from '../../../utils/AccessControllet'
import { AuthContext } from '../../../utils/Auth'
import cl from './Resumes.module.css'

const page_size = 10
const max_buttons_display = 10

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

  let {user} = useContext(AuthContext)

  function updatePage(page) {
    setPages({...pages,cur_page:page})
    setLoads({...loads,cur_page:true})
  }

  function deletePost(id){
    delete_resume(id,(status)=>{
      if (status===204){
        setPage(resumes.filter((el)=>el._id!==id))
      }
    })
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
  
  const tagRegex = /<\/?.+?>/g


  return (
    loads.pages_count
    ? <LoadPlaceholder/>
    : !pages.total_pages?
    <h2>По версии сервера тут пусто</h2>
    : <div className={cl.ItemList}>
        {
          loads.cur_page
          ? <LoadPlaceholder/>
          : resumes.map((value,index)=>{
            return <div key={value._id} className={cl.Item}>
              <Link style={{textDecoration:'none', color:'black'}} to={`/resume/${value._id}`}>
              <h3>{index+(pages.cur_page-1)*page_size+1}. {value.title}</h3>
              <p>{value.body.substring(0,50).split(tagRegex).join('')}...</p>
              </Link>
              <div className={cl.Controls}>
                <AccessController accessProvider={()=>user.level>=2}>
                  <button onClick={()=>{deletePost(value._id)}}>delete</button>
                </AccessController>
                <AccessController accessProvider={()=>  user.level>=1}>
                  <Link to={`/resume/${value._id}/edit`}>
                    <button>Edit</button>
                  </Link>
                </AccessController>
              </div>
            </div>
          })
        }
      <ListButtons max_items={max_buttons_display} total_items={pages.total_pages} cur_item={pages.cur_page} setCur={updatePage}/>
    </div>
  )
}

export default Resumes