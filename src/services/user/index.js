import express from "express"
import { tokenMiddleware } from "../../auth/tokenMiddleware.js"
import users from './user-handlers.js'
import multer from 'multer'
import { saveToUser } from "../../lib/cloudinaryTool.js"

const router = express.Router()

router
  .route("/",tokenMiddleware)
  .get(users.getUsers)

router
  .route("/register")
  

  
router
  .route("/me",tokenMiddleware)
  .get(users.getUserMe)
  .put(users.updateUserMe)
  .delete(users.deleteUserMe)

router
  .route("me/avatar",tokenMiddleware,multer({storage:saveToUser}).single('avatar'))
  .post(users.uploadAvatar)

export default router
