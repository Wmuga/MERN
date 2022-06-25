import mongoose, {Schema, model} from "mongoose"
import app_options from '../app_options.json'
import {createHmac} from "crypto"
import {Application} from 'express'
import { sessionUserStorage, userType } from "../utils/session"
import bodyParser from "body-parser"
import multer from "multer"
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
//Папка загрузки
const upload = multer({dest:"tmp/"})


mongoose.connect(app_options.db_url)


const userSchema: Schema = new Schema({
  username: String,
  password: String,
  pfp: Number,
  level: Number
})

const userModel = model('users',userSchema)

//Функция хэширования. Двухэиапное хеширование sha256 с солью
function hash(str:string){
  let sha256 = createHmac("sha256",app_options.salt)
  const r1 = sha256.update(str)
  sha256 = createHmac("sha256",r1.digest('hex'))
  const r2 = sha256.update(app_options.salt)
  return r2.digest('hex')
} 

function documentToUser(document:any):userType{
  return {
    userId:document._id,
    username:document.username,
    pfp:document.pfp,
    level:document.level
  }
}

async function get_user(_id:string,callback:(user:userType|undefined)=>any){
  let res = await userModel.find({_id}).exec()
  if (res.length){
    callback(documentToUser(res[0]))
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
  userModel.find({_id}).then(value=>{
    if (!value.length){
      callback(path.join(process.cwd(),"public","pfp","nopic.jpg"))
    }
    callback(path.join(process.cwd(),"public","pfp",value[0].pfp?`${_id}.jpg`:"nopic.jpg"))
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
    // Note: handle no session
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
  // User profile
  app.get('/users/:userId',(req,res)=>{
    //check for header
    if (!req.headers.authorization){
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
    if (!req.headers.authorization){
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
    if (!req.headers.authorization){
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
}


export default route_users



function test(){
  const testUser = new userModel({
    username:'admin',
    password:hash('admin'),
    pfp:0,
    level:3
  })
  
  testUser.save()
}