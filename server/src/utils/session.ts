import { userType } from "../types/types"

class SessionStorage{
  storage:{[auth:string]:userType}

  constructor(){
    this.storage = {}
  }

  addUser(auth:string,user:userType){
    this.storage[auth]=user
  }

  getUser(auth:string):userType{
    return this.storage[auth]
  }

  checkAuth(auth:string):boolean{
    return !!this.storage[auth]
  }

  removeUser(auth:string){
    delete this.storage[auth]
  }
}

export let sessionUserStorage = new SessionStorage()