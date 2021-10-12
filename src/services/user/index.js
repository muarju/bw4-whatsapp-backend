import express from "express"
import { tokenMiddleware } from "../../auth/tokenMiddleware.js"
import users from './user-handlers.js'
import multer from 'multer'
import { saveToUser } from "../../lib/cloudinaryTool.js"
import passport from 'passport'

const router = express.Router()

router
  .route("/")
  .get(users.getAll)


// routes for google logins
router.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
  try {
    console.log("redirect")
    console.log(req.user)
    res.cookie("token", req.user.token, {
      httpOnly: true,
    })
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials',true);
    res.redirect(`http://localhost:3000`)
  } catch (error) {
    next(error)
  }
})

router
  .route("/register")
  .post(users.create)
  
router
.route("/login")
.post(users.Login)
  
router
  .route("/me")
  .get(tokenMiddleware, users.getUserMe)
  .put(users.updateUserMe)
  .delete(users.deleteUserMe)

router
  .route("me/avatar",tokenMiddleware,multer({storage:saveToUser}).single('avatar'))
  .post(users.uploadAvatar)

router
  .route("/:userId")
  .get(users.getOneUser)


export default router
