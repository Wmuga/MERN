import { useCookies } from 'react-cookie';
import { createContext,  useState } from 'react';
import { get_session } from '../API/users';
import { randstr } from './utils';

export let AuthCookie = ''

export const AuthContext = createContext({
  user:{
    username:''
  },
  setUser:()=>{}
})

export function Auth(){

  let [cookie, setCookie] = useCookies(["auth"])
  let cur_cookie = cookie
  AuthCookie = cookie

  if(!Object.keys(cookie).length){
    cur_cookie = randstr(32)
    AuthCookie = cookie
    setCookie('auth',cur_cookie,{path:"/"})
  }
}

export function AuthContextProvider({children}){
  const [user,setUser] = useState(undefined)

  if (!user){
    get_session((user)=>{
      setUser(user)
    })
  }

  return(
    <AuthContext.Provider value={{user,setUser}}>
      {children}
    </AuthContext.Provider>
  )
}

