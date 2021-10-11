import express from "express"
import users from './user-handlers.js'


const router = express.Router()

router
  .route("/")
  .get(users.getAll)
  .get(users.getOneUser)

router
  .route("/register")
  .post(users.create)
router
.route("/login")
.post(users.Login)
  
router
  .route("/me")
  .get(users.getUserMe)
  .put(users.updateUserMe)
  .delete(users.deleteUserMe)

router
  .route("me/avatar")
  .put(users.uploadAvatar)


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
