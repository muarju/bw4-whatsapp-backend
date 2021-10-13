import supertest from "supertest"
import {server} from "../server/index.js"
import dotenv from "dotenv"
import mongoose, { connection } from "mongoose"
import tests from './tests-handlers.js'
import { it } from "jest-circus"



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
    
    // it("Description of what iss testing", tests.userCreation)

    
    
    afterAll(done => {
        mongoose.connection.dropDatabase().then(() => {
            console.log("DB dropped, removed testing DB")

            mongoose.connection.close().then(() => {
                done()
            })
        })
    })
    const validUser = {
        name:'',
        email:''
    }
    const invalidUser = {
        name:''
    }

    const updateUser ={
        name: "",
        email: ''
    }

    const deleteUser = {
        name: "",
        email: ''
    }

    it("should test that the endpoint user/not-existing endpoint is ok",async()=>{
        const response = await request.get('/user')
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('test success')
    })

    it("should test that /can'tFound endpoint is returning 404",async()=>{
        const response = await request.get('/not-existing')
        expect(response.status).toBe(404)
    })

    it('should test that a POST /user/me is  returning a valid user',async()=>{
        
        const response = await request.post('/user/me').send(validUser)
        expect(response.status).toBe(201)
        expect(response.body._id).toBeDefined()
    })

    it('should test that a POST /user/me is returning us an invalid user',async()=>{
        
        const response = await request.post('/user/me').send(invalidUser)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('test unsuccessful')
    })

    it('should test that the GET /user/me endpoint is returning a valid user',async()=>{
        const response= await request.get('/user')
        expect(response.status).toBe(200)
        
    })
})


