import GoogleStrategy from "passport-google-oauth20"
import passport from "passport"
import userModel from "../DB/Schema/User.js"
import jwt from 'jsonwebtoken'
import {generateJWTToken} from './tokenTools.js'

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      // We are receiving some profile information from Google
      console.log(profile)

      // 1. Check if user is already in db or not.

      const user = await userModel.findOne({ googleId: profile.id })

      if (user) {
        // 2. If user was already there we are creating the tokens for him/her

        const token = await generateJWTToken(user)

        passportNext(null, { token })
      } else {
        // 3. If it is not we are creating a new record and then we are creating the tokens for him/her
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile._json['picture'],
          googleId: profile.id,
        }

        const createdUser = new userModel(newUser)
        const savedUser = await createdUser.save()
        const token = await generateJWTToken(savedUser)

        passportNext(null, { user: savedUser, token })
      }
    } catch (error) {
      console.log(error)
      passportNext(error)
    }
  }
)

passport.serializeUser(function (user, passportNext) {
  passportNext(null, user) // MANDATORY. This attaches stuff to req.user
})

export default googleStrategy