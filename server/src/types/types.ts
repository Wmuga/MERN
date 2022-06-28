import {Schema, model} from "mongoose"

export type userType = {
  userId:string
  username: string,
  pfp: Number,
  level: Number
} 

export type resumeType = {
  _id:string,
  title:string,
  body:string,
  author:userType
}

const resumeShema: Schema = new Schema({
  title: String,
  body: String,
  author: { type: Schema.Types.ObjectId, ref: 'users' }
})

export const resumeModel = model('resumes',resumeShema)

export type vacancyType = {
  _id:string,
  title:string,
  body:string,
  author:userType
}

const vacancyShema: Schema = new Schema({
  title: String,
  body: String,
  author: { type: Schema.Types.ObjectId, ref: 'users' }
})

export const vacancyModel = model('vacancies',vacancyShema)


const userSchema: Schema = new Schema({
  username: String,
  password: String,
  pfp: Number,
  level: Number,
  vacancies: [{ type: Schema.Types.ObjectId, ref: 'vacancies' }],
  resumes: [{ type: Schema.Types.ObjectId, ref: 'resumes' }]
})

export const userModel = model('users',userSchema)

export type userProfileType = {
  userId:string
  username: string,
  pfp: Number,
  level: Number,
  resumes:any[],
  vacancies:any[]
} 


export function documentToUser(document:any):userType{
  return {
    userId:document._id,
    username:document.username,
    pfp:document.pfp,
    level:document.level,
  }
}

export function documentToResume(document:any):resumeType{
  return {
    _id:document._id,
    title:document.title,
    body:document.body,
    author:documentToUser(document.author)
  }
}


export function documentToVacancy(document:any):vacancyType{
  return {
    _id:document._id,
    title:document.title,
    body:document.body,
    author:documentToUser(document.author)
  }
}

export function documentToUserProfile(document:any):userProfileType{
  return {
    ...documentToUser(document),
    resumes:document.resumes,
    vacancies:document.vacancies
  }
}