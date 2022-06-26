import {Application} from 'express'
import mongoose from 'mongoose'
import users from './users'
import vacancies from './vacancies'
import app_options from '../app_options.json'

mongoose.connect(app_options.db_url)

const route = (app:Application)=>{
  users(app)
  vacancies(app)
}

export default route