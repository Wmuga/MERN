import app_options from '../app_options.json'
import {createHmac} from "crypto"
import {Application} from 'express'
import { sessionUserStorage } from "../utils/session"
import bodyParser from "body-parser"
import multer from "multer"
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { documentToUser, documentToUserProfile, userModel, userProfileType, userType } from "../types/types"
//Папка загрузки
const upload = multer({dest:"tmp/"})


//Функция хэширования. Двухэиапное хеширование sha256 с солью
function hash(str:string){
  let sha256 = createHmac("sha256",app_options.salt)
  const r1 = sha256.update(str)
  sha256 = createHmac("sha256",r1.digest('hex'))
  const r2 = sha256.update(app_options.salt)
  return r2.digest('hex')
} 


async function get_user(_id:string,callback:(user:userProfileType|undefined)=>any){
  let res = await userModel.findById(_id).populate('resumes').populate('vacancies').exec()
  if (res?._id){
    callback(documentToUserProfile(res))
    return
  }
  callback(undefined)
}

async function find_user(username:string,password:string,callback:(user:userType|undefined)=>any){
  let res = await userModel.find({username,password:hash(password)}).exec()
  if (res.length){
    callback(documentToUser(res[0]))
    return
  }
  callback(undefined)
}

async function create_user(username:string,password:string,callback:(user:userType|undefined)=>any){
  let res = await userModel.find({username}).exec()
  if (res.length) {
    callback(undefined)
    return
  }

  const newUser = new userModel({
    username,password:hash(password),pfp:0,level:0
  })

  await newUser.save()
  
  callback(documentToUser(newUser))
}

function delete_user(_id:string,callback:(deleted:Boolean)=>any){
  userModel.deleteOne({_id},function(err){
    if (err){
      console.log(err)
      callback(false)
      return
    }
    callback(true)
  })
}

function update_pic(_id:string,filepath:string,callback:(updated:Boolean)=>any){
  userModel.updateMany({_id},{pfp:1}).then(()=>{
    // Достаем изображение из временного файла
    let image = sharp(filepath)
    // Изменяем его размеры
    image.resize(64,64,{fit:"inside"})
    // Сохрняем в папке фото пользователя
    image.toFile(path.join(process.cwd(),"public","pfp",`${_id}.jpg`)).then(()=>{
      // Удаление временного файла
      fs.unlink(filepath,()=>{})
      callback(true)
    })
  })
}

function get_user_pic(_id:string,callback:(picPath:string)=>any){
  userModel.findById(_id).then(value=>{
    if (!value?._id){
      callback(path.join(process.cwd(),"public","pfp","nopic.jpg"))
    }
    callback(path.join(process.cwd(),"public","pfp",value?.pfp?`${_id}.jpg`:"nopic.jpg"))
  })
}

async function getUsers(limit:number,page:number,callback:(vacancies:userType[]|[])=>any){
  let skip = limit*(page-1)
  let res = skip>0 
  ? await userModel.find({},null,{limit:100}).exec()
  : await userModel.find({},null,{skip,limit}).exec()
  if (res.length){
    callback(res.map(e=>documentToUser(e)))
    return
  }
  callback([])
}

function count_users(callback:(count:Number)=>any){
  userModel.count({},function(_,count){
    callback(count)
  })
}

const route_users = async(app:Application)=>{
  //Get user session
  app.get('/session',(req,res)=>{
    //check for header
    if (!req.headers.authorization){
      res.status(403).end()
      return
    }
    res.end(JSON.stringify(sessionUserStorage.getUser(req.headers.authorization)??{}))
  })
  // Login user
  app.post('/login',bodyParser.json(),(req,res)=>{
    //check for header
    if (!req.headers.authorization){
      res.status(403).end()
      return
    }
    find_user(req.body.login,req.body.password,(user)=>{
      if (typeof(user)!='undefined') sessionUserStorage.addUser(req.headers!.authorization!.toString(),<userType>user)
      res.end(JSON.stringify(user??{}))
    })
  })
  app.post('/logout',(req,res)=>{
    //check for header
    if (!req.headers.authorization){
      res.status(403).end()
      return
    }
    sessionUserStorage.removeUser(req.headers.authorization)
    res.end()
  })
  // Signin user
  app.post('/signin',bodyParser.json(),(req,res)=>{
    //check for header
    if (!req.headers.authorization){
      res.status(403).end()
      return
    }
    create_user(req.body.login,req.body.password,(user)=>{
      if (typeof(user)!='undefined') sessionUserStorage.addUser(req.headers!.authorization!.toString(),<userType>user)
      res.end(JSON.stringify(user??{}))
    })
  })
   // Users count
   app.get('/users/count',(req,res)=>{

    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }

    count_users((count)=>{
      res.end(count.toString())
    })
  })
  // User profile
  app.get('/users/:userId',(req,res)=>{
    //check for header
    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }

    let {userId} = req.params
    if (userId.length<12) {
      res.status(404).end()
      return
    }
    get_user(userId,(user)=>{
      res.end(JSON.stringify(user))
    })
  })
  //Delete user
  app.delete('/users/:userId',(req,res)=>{
    //check for header
    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }

    let {userId} = req.params
    if (userId.length<12) {
      res.status(404).end()
      return
    }
    delete_user(userId,(deleted)=>{
      res.status(deleted?204:500).end()
    })
  })
  //Update pfp
  app.post('/users/:userId/pfp',upload.single('file'),(req,res)=>{
    //check for header
    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }

    let {userId} = req.params
    if (userId.length<12) {
      res.status(404).end()
      return
    }
    if (!req.file?.filename) {
      res.end()
      return
    }

    update_pic(userId,req.file.path,(added)=>{
      res.status(added? 200: 500).end()
    })
    
  })
  //Profile picure
  app.get('/users/:userId/pfp',(req,res)=>{
    let {userId} = req.params
    if (userId.length<12) {
      res.status(404).end()
      return
    }
    
    get_user_pic(userId,(pic)=>{
      res.sendFile(pic)
    })
  })

  // Users
  app.get('/users',(req,res)=>{

    let max = Number(req.query["_limit"])
    let page = Number(req.query["_page"])

    max = max>0 ? max : 0
    page = page>0 ? page : 1

    if (!req.headers.authorization || !sessionUserStorage.checkAuth(req.headers.authorization)){
      res.status(403).end()
      return
    }


    getUsers(max,page,(users)=>{
      res.end(JSON.stringify(users))
    })
  })
}


export default route_users