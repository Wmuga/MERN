import mongoose, {Schema, model} from "mongoose"
import app_options from '../app_options.json'
import {Application} from 'express'
import bodyParser from "body-parser"
import { sessionUserStorage, userType } from "../utils/session"

// mongoose.connect(app_options.db_url)

type vacancyType = {
  _id:string,
  title:string,
  body:string,
  author:userType
}

const vacancyShema: Schema = new Schema({
  title: String,
  body: String,
  author: [{ type: Schema.Types.ObjectId, ref: 'users' }],
})

const vacancyModel = model('vacancies',vacancyShema)

function documentToUser(document:any):userType{
  return {
    userId:document._id,
    username:document.username,
    pfp:document.pfp,
    level:document.level,
  }
}

function documentToVacancy(document:any):vacancyType{
  return {
    _id:document._id,
    title:document.title,
    body:document.body,
    author:documentToUser(document.author)
  }
}

async function get_vacancy(_id:string,callback:(user:vacancyType|undefined)=>any){
  let res = await vacancyModel.findById(_id).populate('author').exec()
  if (res?._id){
    callback(documentToVacancy(res))
    return
  }
  callback(undefined)
}

async function find_vacancy(body:string,limit:number,page:number,callback:(vacancies:vacancyType[]|[])=>any){
  let skip = limit*(page-1)
  let res = skip>0 
  ? await vacancyModel.find({body:new RegExp(`*${body}*`,'i')}).populate('author').exec()
  : await vacancyModel.find({body:new RegExp(`*${body}*`,'i')},null,{skip,limit}).populate('author').exec()
  if (res.length){
    callback(res.map(e=>documentToVacancy(e)))
    return
  }
  callback([])
}

async function create_vacancy(title:string,body:string,authorId:string,callback:(added:boolean)=>any){
  const newVacancy = new vacancyModel({
    title,
    body,
    author:authorId
  })

  await newVacancy.save()

  callback(true)
}

function delete_vacancy(_id:string,callback:(deleted:Boolean)=>any){
  vacancyModel.deleteOne({_id},function(err){
    if (err){
      console.log(err)
      callback(false)
      return
    }
    callback(true)
  })
}


const route_vacancies = async(app:Application)=>{
  // Vacancy
  app.get('/vacancies/:vacancyId',(req,res)=>{
    //check for header
    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }

    let {vacancyId} = req.params
    if (vacancyId.length<12) {
      res.status(404).end()
      return
    }
    
    get_vacancy(vacancyId,(user)=>{
      res.end(JSON.stringify(user))
    })
  })
  // Create vacancy
  app.post('/vacancies/create',bodyParser.json(),(req,res)=>{
    //check for header
    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }
    let authorId = sessionUserStorage.getUser(req.headers.authorization).userId
    create_vacancy(req.body.title,req.body.body,authorId,(added)=>{
      res.status(added?204:500).end()
    })
  })
  //Delete user
  app.delete('/vacancies/:vacancyId',(req,res)=>{
    //check for header
    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }

    let {vacancyId} = req.params
    if (vacancyId.length<12) {
      res.status(404).end()
      return
    }
    delete_vacancy(vacancyId,(deleted)=>{
      res.status(deleted?204:500).end()
    })
  })
}


export default route_vacancies



// function test(){
//   const testUser = new vacancyModel({
//     username:'admin',
//     password:hash('admin'),
//     pfp:0,
//     level:3
//   })
  
//   testUser.save()
// }