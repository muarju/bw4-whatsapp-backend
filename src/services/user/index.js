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
.route("/login")
.post(users.Login)
  
router
  .route("/me")
  .get(users.getSingle)
  .put(users.update)
  .delete(users.deleteSingle)



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
