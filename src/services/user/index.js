import express from "express"
import users from './user-handlers.js'


const router = express.Router()

router
  .route("/")
  .get(users.getUsers)

router
  .route("/register")
  

  
router
  .route("/me")
  .get(users.getUserMe)
  .put(users.updateUserMe)
  .delete(users.deleteUserMe)

router
  .route("me/avatar")
  .put(users.uploadAvatar)

export default router
