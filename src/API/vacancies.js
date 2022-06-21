import axios from "axios";

export function fetch_vacancy(id, callback){
  axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`).then((value)=>{
    callback(value.data)
  })
}

export function fetch_vacancies_page(page,page_size, callback){
  axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=${page_size}&_page=${page}`).then((value)=>{
    callback(value.data)
  })
}

export function fetch_vacancies_pages_count(page_size,callback){
  axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=${page_size}`).then((value)=>{
    callback(Math.ceil(value.headers["x-total-count"]/page_size))
  })
}

export function delete_vacancy(id,callback){
  axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`).then((value)=>{
    callback(value.status)
  })
}

export function edit_vacancy(vacancy, callback){
  axios.put(`https://jsonplaceholder.typicode.com/posts/${vacancy.id}`,vacancy).then((value)=>{
    callback(value.status)
  })
}