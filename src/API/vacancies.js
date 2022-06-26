import axios from "axios";
import options from "../app_options.json"
import { AuthCookie } from "../utils/Auth";

export function fetch_vacancy(id, callback){
  axios.get(`${options.APIserver}/vacancies/${id}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data)
  })
}

export function fetch_vacancies_page(page,page_size, callback){
  axios.get(`${options.APIserver}/vacancies?_limit=${page_size}&_page=${page}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data)
  })
}

export function find_vacancies(query,page,page_size, callback){
  axios.get(`${options.APIserver}/vacancies?query=${query}&_limit=${page_size}&_page=${page}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data)
  })
}

export function fetch_vacancies_pages_count(page_size,callback){
  axios.get(`${options.APIserver}/vacancies/count`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data/page_size)
  })
}

export function delete_vacancy(id,callback){
  axios.delete(`${options.APIserver}/vacancies/${id}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.status)
  })
}

export function create_vacancy(vacancy, callback){
  axios.post(`${options.APIserver}/vacancies/create`,vacancy,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.status)
  })
}

export function edit_vacancy(vacancy, callback){
  axios.put(`${options.APIserver}/vacancies/${vacancy._id}`,vacancy,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.status)
  })
}