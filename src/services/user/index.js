import express from "express"
import { tokenMiddleware } from "../../auth/tokenMiddleware.js"
import users from './user-handlers.js'
import multer from 'multer'
import { saveToUser } from "../../lib/cloudinaryTool.js"

const router = express.Router()

router
  .route("/")
  .get(users.getAll)


  
  router
  .route("/register")
  .post(users.create)
  router
  .route("/login")
  .post(users.Login)
  
  router
  .route("/me")
  .get(tokenMiddleware,users.getUserMe)
  .put(tokenMiddleware,users.updateUserMe)
  .delete(tokenMiddleware,users.deleteUserMe)
  
  router
  .route("/me/avatar")
  .post(tokenMiddleware,multer({storage:saveToUser}).single('avatar'),users.uploadAvatar)

  
  router
    .route("/:userId")
    .get(users.getOneUser)

//routes for google logins
// authorsRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }))

// authorsRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
//   try {
//     console.log("redirect")
//     console.log(req.user)
//     res.cookie("token", req.user.token, {
//       httpOnly: true,
//     })
//     res.redirect(`http://localhost:3000`)
//   } catch (error) {
//     next(error)
//   }
// })


export default router
