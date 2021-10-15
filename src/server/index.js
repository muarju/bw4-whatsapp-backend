import express from "express"
import lib from "../lib/index.js"
import cors from "cors"
import connectToDB from '../DB/conn/index.js'
import userRouters from '../services/user/index.js'
import chatRouters from '../services/chat/index.js'
import { connectSocket } from "../socket/index.js"
import passport from "passport"
import GoogleStrategy from "../auth/oauth.js"
import cookieParser from "cookie-parser"

const {corsConfig, errorHandlers} = lib

export const server = express()
server.use(express.json())

passport.use("google", GoogleStrategy)
server.use(cookieParser())
server.use(cors(corsConfig))

server.use(passport.initialize())
server.use("/user", userRouters)
server.use("/chat", chatRouters)

server.use(errorHandlers.forbidden)
server.use(errorHandlers.notFound)
server.use(errorHandlers.badRequest)
server.use(errorHandlers.unauthorizedHandler)
server.use(errorHandlers.server)



//the process.env variables are existent in PROD and DEV mode, but are INEXISTENT when running test on JEST,
// so when running the test it wont connect to the DB and either will listen the server
//This will prevent the code below to run in test environment


if((process.env.MONGO_DEV_URL) || (process.env.MONGO_PROD_URL)){
    connectSocket(server)
    console.log("DB conn server!!!!!")
    connectToDB()
    server.on("error", (error) =>
        console.log("🚀 Server is crashed due to ", error)
    )
} 
