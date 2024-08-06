import express from "express"
import { createUser , getUserFromDb , createTask , getTasks , deleteTaskByTitle} from "../routes/routes.js"


const router = express.Router()

router.post("/newuser" , createUser)       //endpoint to create a new user ie registering a new user
router.post("/login" , getUserFromDb)      //endpoint to login in to the system ie existing user
router.post("/task" , createTask)         //api endpoint to create the tasks in the db
router.get("/gettask" , getTasks)
router.delete("/deleteTask" , deleteTaskByTitle) //api end point to delete the tasks using the task title













export default router