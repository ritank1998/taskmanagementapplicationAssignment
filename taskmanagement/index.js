import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import directus from "./router/router.js"           //import all the routers for directus api
import dotenv from "dotenv"
const app = express()
const port = 9100
dotenv.config()


app.use(cors())
app.use(express.json())



app.get("/health" , (req,res)=>{
res.status(200).send("Health Is awesome")
})

app.use("/directusapi" , directus)                 //set route for directus api

app.listen(port ,()=>{
       console.log("Application is listening at port" , port)
})