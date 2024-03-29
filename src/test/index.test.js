import dotenv from "dotenv"
import mongoose from "mongoose"
import tests from './tests-handlers.js'
// import { connectSocket } from "../socket/index.js"
import {server} from '../server/serverStart.js'
import {createServer} from 'http'


dotenv.config()

console.log({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
  }, '<STRATEGY')

describe("Testing the testing environment", () => {
    it("should test that true is true", () => {
       expect(true).toBe(true);
    })
})

describe("Testing the server", () => {

    beforeAll(done => {
        // createServer().listen()
       //process MONGO WORKING
        mongoose.connect(process.env.MONGO_TEST_URL)
            .then(() => {
                console.log("Connected to Atlas")
                done()
            }).catch(err=>console.log(err))
    }) 

    afterAll(done => {
        mongoose.connection.dropDatabase()
             .then(() => {
                console.log("DB dropped, removed testing DB")
                
                mongoose.connection.close().then(() => {
                    done()
                })
            })
        })
    
    it("should test that a POST /user/register is  creating a valid user", tests.userCreation)
    it("should test that a POST /user/register is  creating an invalid user", tests.invalidUserCreation)
    it("should test that a POST /user/login is  returning a valid user", tests.validUserLogin)
    it("should test that a POST /user/login is  returning an invalid user", tests.invalidUserLogin)
    it("should test that a GET  /user/me is  returning a user", tests.getUserMe)
    it("should test that a PUT  /user/me is  updating a valid user", tests.updateUserMe)
    it("should test that a DELETE /user/me is  deleting a user", tests.deleteUserMe) 
})


