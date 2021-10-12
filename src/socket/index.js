import { Server } from 'socket.io'
import { createServer } from 'http';
import socketHandlers from './socket-handlers.js';
import express from "express"
import Chat from '../DB/Schema/Chat.js'
import Message from '../DB/Schema/Message.js'

const app = express()

export const connectSocket = (server) => {
    try {
        const httpServer = createServer(server)
        const io = new Server(httpServer, { allowEIO3: true })
        httpServer.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`)
        })


        io.on('connection', socket => {
            console.log(socket.id)

        socket.on("example", socketHandlers.example)

        socket.on("createRoom",async (payload) => {
            const newChat = new Chat({members: payload})
            const newlyCreatedRoom = await newChat.save({new: true})
            const room=newlyCreatedRoom._id
            socket.join(room)
            socket.emit("roomCreated", newlyCreatedRoom)
        })


        socket.on("newMessage",async (payload) => {
         try {
            const {message,userId,roomId}=payload
            const messageObject={
                sender:userId,
                content:{
                    text: message,
                }
            }
            const newMessage=new Message(messageObject)
            const saveMessage=await newMessage.save({new: true})
            if(saveMessage){
            const newMessageId = saveMessage._id.toString()
            
            const updateChat = await Chat.findByIdAndUpdate(roomId,{$push:{history: newMessageId}},{new:true})
            socket.emit('UpdateChatHistory',updateChat)
            }

         } catch (error) {
             console.log(error)
         }
           
        })

        socket.on("deleteMessage",async (payload) => {
            const {roomId, messageId} = payload
            try {
                const updateChat = await Chat.findByIdAndUpdate(roomId,{$pull:{history: messageId}},{new:true})
                const deleteFromMessage=await Message.findByIdAndDelete(messageId)
                socket.emit('UpdateChatHistory',updateChat)
   
            } catch (error) {
                console.log(error)
            }
   
              
           })
        
        // all cations
        // all cations join room (to send to that room )
        // to(will send to specific room)
        // socket.on (will receive an emit from the Front-end)
        // socket.emit (will send a command to the Front-end)
        // socket.broadcast (will send a command to everyone who is connected)
        socket.on("disconnect", () => {
            socket.broadcast.emit("UpdateTotalUsers")
        })
        
        })

        
    } catch (error) {
        console.log(error)
    }
}