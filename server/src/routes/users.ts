import mongoose, {Schema, model, ObjectId, Model} from "mongoose"
import app_options from '../app_options.json'
import {Application} from 'express'

mongoose.connect(app_options.db_url)

type userType = {
  _id:String
  username: String,
  pfp: Number,
  level: Number
}

const userSchema: Schema = new Schema({
  username: String,
  password: String,
  pfp: Number,
  level: Number
})

const userModel = model('users',userSchema)

function documentToUser(document:any):userType{
  return {
    _id:document._id,
    username:document.username,
    pfp:document.pfp,
    level:document.level
  }
}

async function get_user(_id:String,callback:(user:userType|null)=>any){
  let res = await userModel.find({_id}).exec()
  if (res.length){
    callback(documentToUser(res[0]))
    return
  }
  callback(null)
}

async function find_user(username:String,password:String,callback:(user:userType|null)=>any){
  let res = await userModel.find({username,password}).exec()
  if (res.length){
    callback(documentToUser(res[0]))
    return
  }
  callback(null)
}

async function create_user(username:String,password:String,callback:(added:Boolean)=>any){
  let res = await userModel.find({username}).exec()
  if (res.length) {
    callback(false)
    return
  }

  const newUser = new userModel({
    username,password,pfp:0,level:0
  })

  await newUser.save()
  
  callback(true)
}

function delete_user(_id:String,callback:(deleted:Boolean)=>any){
  userModel.deleteOne({_id},function(err){
    if (err){
      console.log(err)
      callback(false)
      return
    }
    callback(true)
  })
}

const route_users = async(app:Application)=>{
  //Send user data
  app.get('/users/:userId',(req,res)=>{
    let {userId} = req.params
    get_user(userId,(user)=>{
      res.end(JSON.stringify(user))
    })
  })
  //Delete user
  app.delete('/users/:userId',(req,res)=>{
    let {userId} = req.params
    delete_user(userId,(deleted)=>{
      res.status(deleted?204:500).end()
    })
  })
}


export default route_users



function test(){
  const testUser = new userModel({
    username:'tester',
    password:'test',
    pfp:0,
    level:3
  })
  
  testUser.save()
}