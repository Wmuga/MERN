import {Application} from 'express'
import bodyParser from "body-parser"
import { sessionUserStorage } from "../utils/session"
import { documentToVacancy,  userModel,  vacancyModel, vacancyType } from "../types/types"


async function edit_vacancy(_id:string,title:string,body:string,callback:(updated:boolean)=>any){
  let res = await vacancyModel.updateOne({_id},{title,body}).exec()
  callback(!!res.modifiedCount)
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
  ? await vacancyModel.find({body:new RegExp(`${body}`,'i')},null,{limit:100}).populate('author').exec()
  : await vacancyModel.find({body:new RegExp(`${body}`,'i')},null,{skip,limit}).populate('author').exec()
  if (res.length){
    callback(res.map(e=>documentToVacancy(e)))
    return
  }
  callback([])
}

function count_vacancies(callback:(count:Number)=>any){
  vacancyModel.count({},function(_,count){
    callback(count)
  })
}

async function create_vacancy(title:string,body:string,authorId:string,callback:(added:boolean)=>any){
  const newVacancy = new vacancyModel({
    title,
    body,
    author:authorId
  })

  
  await newVacancy.save()
  
  let author = await userModel.findById({_id:authorId}).exec()
  author?.vacancies?.push(newVacancy)
  await author?.save()

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
  // Vacancies
  app.get('/vacancies/',(req,res)=>{

    let max = Number(req.query["_limit"])
    let page = Number(req.query["_page"])
    let query = req.query["query"]?.toString()??""

    max = max>0 ? max : 0
    page = page>0 ? page : 1


    find_vacancy(query,max,page,(vacancies)=>{
      res.end(JSON.stringify(vacancies))
    })
  })
   // Vacancies count
   app.get('/vacancies/count',(req,res)=>{

    count_vacancies((count)=>{
      res.end(count.toString())
    })
  })
  // Vacancy
  app.get('/vacancies/:vacancyId',(req,res)=>{

    let {vacancyId} = req.params
    if (vacancyId.length<12) {
      res.status(404).end()
      return
    }
    
    get_vacancy(vacancyId,(user)=>{
      res.end(JSON.stringify(user))
    })
  })
  // Edit
  app.put('/vacancies/:vacancyId',bodyParser.json(),(req,res)=>{

    let {vacancyId} = req.params
    if (vacancyId.length<12) {
      res.status(404).end()
      return
    }

    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }

    const title = req.body?.title
    const body = req.body?.body

    edit_vacancy(vacancyId,title,body,(edited)=>{
      res.status(edited?204:500).end()
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

  //Delete vacancy
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
