import {Application} from 'express'
import bodyParser from "body-parser"
import { sessionUserStorage } from "../utils/session"
import { documentToResume, resumeModel, resumeType, userModel } from "../types/types"


async function edit_resume(_id:string,title:string,body:string,callback:(updated:boolean)=>any){
  let res = await resumeModel.updateOne({_id},{title,body}).exec()
  callback(!!res.modifiedCount)
}

async function get_resume(_id:string,callback:(user:resumeType|undefined)=>any){
  let res = await resumeModel.findById(_id).populate('author').exec()
  if (res?._id){
    callback(documentToResume(res))
    return
  }
  callback(undefined)
}

function count_resumes(callback:(count:Number)=>any){
  resumeModel.count({},function(_,count){
    callback(count)
  })
}

async function create_resume(title:string,body:string,authorId:string,callback:(added:boolean)=>any){
  const newResume = new resumeModel({
    title,
    body,
    author:authorId
  })

  await newResume.save()

  let author = await userModel.findById({_id:authorId}).exec()
  author?.vacancies?.push(newResume)
  await author?.save()

  callback(true)
}

function delete_resume(_id:string,callback:(deleted:Boolean)=>any){
  resumeModel.deleteOne({_id},function(err){
    if (err){
      console.log(err)
      callback(false)
      return
    }
    callback(true)
  })
}

async function get_resumes(limit:number,page:number,callback:(resumes:resumeType[]|[])=>any){
  let skip = limit*(page-1)
  let res = skip>0 
  ? await resumeModel.find({},null,{limit:100}).populate('author').exec()
  : await resumeModel.find({},null,{skip,limit}).populate('author').exec()
  if (res.length){
    callback(res.map(e=>documentToResume(e)))
    return
  }
  callback([])
}

const route_resumes = async(app:Application)=>{
  // resumes
  app.get('/resumes/',(req,res)=>{

    let max = Number(req.query["_limit"])
    let page = Number(req.query["_page"])

    max = max>0 ? max : 0
    page = page>0 ? page : 1


    get_resumes(max,page,(resumes)=>{
      res.end(JSON.stringify(resumes))
    })
  })
   // resumes count
   app.get('/resumes/count',(_,res)=>{

    count_resumes((count)=>{
      res.end(count.toString())
    })
  })
  // Reseume
  app.get('/resumes/:resumeId',(req,res)=>{

    let {resumeId} = req.params
    if (resumeId.length<12) {
      res.status(404).end()
      return
    }
    
    get_resume(resumeId,(user)=>{
      res.end(JSON.stringify(user))
    })
  })
  // Edit
  app.put('/resumes/:resumeId',bodyParser.json(),(req,res)=>{

    let {resumeId} = req.params
    if (resumeId.length<12) {
      res.status(404).end()
      return
    }

    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }
    
    const title = req.body?.title
    const body = req.body?.body

    edit_resume(resumeId,title,body,(edited)=>{
      res.status(edited?204:500).end()
    })
  })

  // Create resume
  app.post('/resumes/create',bodyParser.json(),(req,res)=>{
    //check for header
    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }
    let authorId = sessionUserStorage.getUser(req.headers.authorization).userId
    create_resume(req.body.title,req.body.body,authorId,(added)=>{
      res.status(added?204:500).end()
    })
  })

  //Delete resume
  app.delete('/resumes/:resumeId',(req,res)=>{
    //check for header
    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }

    let {resumeId} = req.params
    
    if (resumeId.length<12) {
      res.status(404).end()
      return
    }
    delete_resume(resumeId,(deleted)=>{
      res.status(deleted?204:500).end()
    })
  })
}


export default route_resumes