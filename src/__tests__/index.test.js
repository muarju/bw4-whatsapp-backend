import supertest from "supertest"
import {server} from "../server/index.js"
import dotenv from "dotenv"
import mongoose from "mongoose"
import tests from './tests-handlers.js'

dotenv.config()
const request = supertest(server)

describe("Testing the testing environment", () => {
    it("should test that true is true", () => {
        expect(true).toBe(true);
    })
})

describe("Testing the server", () => {
    beforeAll(done => {
        mongoose.connect(process.env.MONGO_TEST_URL)
            .then(() => {
                console.log("Connected to Atlas")
                done()
            }).catch(err=>console.log(err))
    }) 
    
  //Test example
    
    it("Description of what iss testing", tests.userCreation)

    
    
    afterAll(done => {
        mongoose.connection.dropDatabase().then(() => {
            console.log("DB dropped, removed testing DB")

            mongoose.connection.close().then(() => {
                done()
            })
        })
    })
})


