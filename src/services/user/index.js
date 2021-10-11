import express from "express"
import users from './user-handlers.js'


const router = express.Router()

router
  .route("/")
  .get(users.getAll)

router
  .route("/register")
  .post(users.create)

  
router
  .route("/me")
  .get(users.getSingle)
  .put(users.update)
  .delete(users.deleteSingle)


export default router
