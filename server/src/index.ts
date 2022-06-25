import express, { Application, Request, Response } from "express"
import bodyParser from "body-parser"
import app_options from './app_options.json'
import route from "./routes/route"
import path from 'path'
import cors from 'cors'

const app:Application = express()

app.use(bodyParser.urlencoded({ limit:'50mb',extended: true }))
app.use(cors())

route(app)

app.use(function(_:Request, res:Response) {
  res.status(404).end()
})

app.use(express.static(path.join(process.cwd(), 'public')))

app.listen(app_options.back_port,()=>{
  console.log(`Working on port ${app_options.back_port}`)
})
