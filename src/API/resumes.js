import axios from "axios";
import options from "../app_options.json"
import { AuthCookie } from "../utils/Auth";

export function fetch_resume(id, callback){
  axios.get(`${options.APIserver}/resumes/${id}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data)
  })
}

export function fetch_resumes_page(page,page_size, callback){
  axios.get(`${options.APIserver}/resumes?_limit=${page_size}&_page=${page}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data)
  })
}

export function find_resumes(query,page,page_size, callback){
  axios.get(`${options.APIserver}/resumes?query=${query}&_limit=${page_size}&_page=${page}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data)
  })
}

export function fetch_resumes_pages_count(page_size,callback){
  axios.get(`${options.APIserver}/resumes/count`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data/page_size)
  })
}

export function delete_resume(id,callback){
  axios.delete(`${options.APIserver}/resumes/${id}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.status)
  })
}

export function create_resume(resume, callback){
  axios.post(`${options.APIserver}/resumes/create`,resume,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.status)
  })
}

export function edit_resume(resume, callback){
  axios.put(`${options.APIserver}/resumes/${resume._id}`,resume,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.status)
  })
}