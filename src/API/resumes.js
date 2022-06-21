import axios from "axios";

// https://jsonplaceholder.typicode.com/posts?_limit=10&_page=1

export function fetch_resume(id, callback){
  axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`).then((value)=>{
    callback(value.data)
  })
}

export function fetch_resumes_page(page,page_size, callback){
  axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=${page_size}&_page=${page}`).then((value)=>{
    callback(value.data)
  })
}

export function fetch_resumes_pages_count(page_size,callback){
  axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=${page_size}`).then((value)=>{
    callback(value.headers["x-total-count"]/page_size)
  })
}