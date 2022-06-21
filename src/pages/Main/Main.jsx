import React from 'react'
import { Link } from 'react-router-dom'
import cl from "./Main.module.css"

const Main = () =>{
  return (
    <div>
      <h2>База анкет соискателей</h2>
      <p>Находите сотрудников и работодателей</p>
      <div className={cl.spread}>
       <Link to="vacancy" className="header_href_deco button_like">Вакансии</Link>
       <Link to="resume" className="header_href_deco button_like">Резюме</Link>
      </div>
    </div>
  )
}

export default Main