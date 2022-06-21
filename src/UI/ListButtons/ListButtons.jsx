import React from "react"
import cl from './ListButtons.module.css'

const ListButtons = ({max_items,total_items, cur_item ,setCur})=>{

  const setItem = (item)=>{if(setCur && typeof(setCur)=='function') setCur(item)}

  return total_items > max_items ?
    (
      <div className={cl.ListButtons}>
        {
          (()=>{
            let content = []
            let key = 0
            // b b b b ... b
            if(cur_item <= max_items-3) 
            {
              for (let i=0;i<max_items-2;i++){
                i+1===cur_item 
                ? content.push(<ListButton key={key++} number={i+1}/>)
                : content.push(<ListButton key={key++} onClick = {()=>{setItem(i+1)}} number={i+1}/>)
              }
              content.push(<ListButton key={key++} disabled number='...'/>)
              content.push(<ListButton key={key++} onClick = {()=>{setItem(total_items)}} number={total_items}/>)
              return content
            } 
            // b ... b b b b
            if(cur_item>=total_items-(max_items-4))
            {
              content.push(<ListButton key={key++} onClick = {()=>{setItem(1)}} number={1}/>)
              content.push(<ListButton key={key++} disabled number='...'/>)
              for (let i=total_items-(max_items-2);i<total_items;i++){
                i+1===cur_item 
                ? content.push(<ListButton key={key++} number={i+1}/>)
                : content.push(<ListButton key={key++} onClick = {()=>{setItem(i+1)}} number={i+1}/>)
              }
              return content
            }
            // b ... b b b ... b
            content.push(<ListButton key={key++} onClick = {()=>{setItem(1)}} number={1}/>)
            content.push(<ListButton key={key++} disabled number='...'/>)

            for (let i=0;i<max_items-3;i++){
              const num = cur_item - parseInt((max_items-3)/2) + i
              num===cur_item 
              ? content.push(<ListButton key={key++} number={num}/>)
              : content.push(<ListButton key={key++} onClick = {()=>{setItem(num)}} number={num}/>)
            }

            content.push(<ListButton key={key++} disabled number='...'/>)
            content.push(<ListButton key={key++} onClick = {()=>{setItem(total_items)}} number={total_items}/>)

            return content
          })()
        }
      </div>
    )
  : // b b b b b b
    (
      <div className={cl.ListButtons}>
        {
          (()=>{
            let key = 0
            let content = []
            for (let i=0;i<total_items;i++){
              i+1===cur_item 
              ? content.push(<ListButton disabled key={key++} number={i+1}/>)
              : content.push(<ListButton key={key++} onClick = {()=>{setItem(i+1)}} number={i+1}/>)
            }
            return content
          })()
        }
      </div>
    )
}

const ListButton = ({number, ...props})=>{
  return (
    <button className={cl.ListButton} {...props}>{number}</button>
  )
}

export default ListButtons