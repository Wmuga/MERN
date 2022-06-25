import axios from "axios";
import options from "../app_options.json"
import { AuthCookie } from "../utils/Auth";

export function fetch_user(id, callback){
  axios.get(`${options.APIserver}/users/${id}`,{
    headers:{'Authorization':AuthCookie}
  }).then((value)=>{
    callback(value.data)
  })
}

export function check_user(login, password, callback){
  axios.post(`${options.APIserver}/login`,{login,password},{
    headers:{'Authorization':AuthCookie}
  }).then(value=>{
    callback(value.data??{})
  })
}

export function create_user(login, password, callback){
  axios.post(`${options.APIserver}/signin`,{login,password},{
    headers:{'Authorization':AuthCookie}
  }).then(value=>{
    callback(value.data??{})
  })
}

export function update_pfp(id,data,callback){
  axios.post(`${options.APIserver}/users/${id}/pfp`,data,{
    headers:{
      'Authorization':AuthCookie,
      'Content-Type': 'multipart/form-data'
    }
  }).then(res=>{
    callback(res.status)
  })
}

export function get_session(callback){
  axios.get(`${options.APIserver}/session`,{
    headers:{'Authorization':AuthCookie}
  }).then(res=>{
    callback(res.data)
  })
}

export function logout(){
  axios.post(`${options.APIserver}/logout`,{},{
    headers:{
      'Authorization':AuthCookie
    }})
}