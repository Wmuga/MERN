import {Application} from 'express'
import users from './users'

const route = (app:Application)=>{
  users(app)
}

export default route