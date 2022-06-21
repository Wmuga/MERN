import axios from "axios";

export function fetch_user(id, callback){
  axios.get(`https://jsonplaceholder.typicode.com/users?id=${id}`).then((value)=>{
    callback(value.data.length? value.data[0] : {})
  })
}

export function check_user(login, password, callback){
  axios.get(`https://jsonplaceholder.typicode.com/users?username=${login}`).then(value=>{
    callback(value.data.length? value.data[0] : {})
  })
}

export function get_session(auth){
  // server-side session cookie set 
}

export function logout(auth){
  // server-side session remove
}