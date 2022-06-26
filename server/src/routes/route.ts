import {Application} from 'express'
import users from './users'
import vacancies from './vacancies'

const route = (app:Application)=>{
  users(app)
  vacancies(app)
}

export default route