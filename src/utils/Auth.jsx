import { useCookies } from 'react-cookie';
import { createContext,  useState } from 'react';


export const AuthContext = createContext({
  user:{
    username:''
  },
  setUser:()=>{}
})

export function Auth({checkUser}){

  let [cookie, setCookie] = useCookies(["auth"])
  let cur_cookie = cookie

  if(!Object.keys(cookie).length){
    cur_cookie = randstr(32)
    setCookie('auth',cur_cookie,{path:"/"})
  }

  if (checkUser && typeof(checkUser)=="function") checkUser(cookie)
}

export function AuthContextProvider({children}){
  const [user,setUser] = useState({})
  return(
    <AuthContext.Provider value={{user,setUser}}>
      {children}
    </AuthContext.Provider>
  )
}

const randstr = (myLength) => {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    () => chars[Math.floor(Math.random() * chars.length)]
  );
  return randomArray.join('')
}