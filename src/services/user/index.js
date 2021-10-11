import express from "express"
import { tokenMiddleware } from "../../auth/tokenMiddleware.js"
import users from './user-handlers.js'
import multer from 'multer'
import { saveToUser } from "../../lib/cloudinaryTool.js"

const router = express.Router()

router
  .route("/")
  .get(users.getAll)
  .get(users.getOneUser)

router
  .route("/:userId")
  .get(users.getOneUser)

router
  .route("/register")
  .post(users.create)
  
router
.route("/login")
.post(users.Login)
  
router
  .route("/me",tokenMiddleware)
  .get(users.getUserMe)
  .put(users.updateUserMe)
  .delete(users.deleteUserMe)

router
  .route("me/avatar",tokenMiddleware,multer({storage:saveToUser}).single('avatar'))
  .post(users.uploadAvatar)


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
