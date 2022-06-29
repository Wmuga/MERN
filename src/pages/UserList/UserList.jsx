import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { fetch_users_page, fetch_users_pages_count } from '../../API/users'
import ListButtons from '../../UI/ListButtons/ListButtons'
import LoadPlaceholder from '../../UI/LoadPlaceholder/LoadPlaceholder'
import { AuthContext } from '../../utils/Auth'
import { AccessControllerRedirect } from '../../utils/AccessControllet'

const page_size = 10
const max_buttons_display = 10

const UserList = () =>{

  const [loads, setLoads] = useState({
    pages_count:true,
    cur_page:true
  })
  const [pages,setPages] = useState({
    total_pages:0,
    cur_page:1
  })

  const [users,setPage] = useState([])

  let {user} = useContext(AuthContext)

  function updatePage(page) {
    setPages({...pages,cur_page:page})
    setLoads({...loads,cur_page:true})
  }

  if (loads.pages_count){
    fetch_users_pages_count(page_size,(total_pages)=>{
      setLoads({...loads,pages_count:false})
      setPages({...pages,total_pages})
    })
  }

  if(loads.cur_page){
    fetch_users_page(pages.cur_page,page_size,(page)=>{
      setPage(page)
      setLoads({...loads,cur_page:false})
    })
  }
  

  return (
    loads.pages_count
    ? <LoadPlaceholder/>
    : !pages.total_pages?
    <h2>По версии сервера тут пусто</h2>
    : <div className='Users'>
        <AccessControllerRedirect redirect='/' accessProvider={()=>user.level>=2}/>
        {
          loads.cur_page
          ? <LoadPlaceholder/>
          : users.map((value,index)=>{
            return <div key={value._id}>
              <Link style={{textDecoration:'none', color:'black'}} to={`/profile/${value.userId}`}>
                <h3>{index+(pages.cur_page-1)*page_size+1}. {value.username}</h3>
              </Link>
            </div>
          })
        }
      <ListButtons max_items={max_buttons_display} total_items={pages.total_pages} cur_item={pages.cur_page} setCur={updatePage}/>
    </div>
  )
}

export default UserList