import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const mongoUrl = process.env.MONGO_DEV_URL ? process.env.MONGO_DEV_URL : process.env.MONGO_PROD_URL

const connectToDB = ()=>{
    mongoose.connect(mongoUrl)
    mongoose.connection.on('connected', () => {
        console.log('Mongo connected') 
        mongoose.connection.on('error', error => {
            console.log('Mongo error: ', error)
        })
    })
}


export default connectToDB


