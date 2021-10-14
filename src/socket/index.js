import { Server } from 'socket.io'
import { createServer } from 'http';
import socketHandlers from './socket-handlers.js';
import express from "express"
import Chat from '../DB/Schema/Chat.js'
import Message from '../DB/Schema/Message.js'
import Users from '../DB/Schema/User.js'

const app = express()


let onlineUsers=[]

export const connectSocket = (server) => {
    try {
        const httpServer = createServer(server)
        const io = new Server(httpServer, { allowEIO3: true })
        httpServer.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`)
        })


        io.on('connection', socket => {
            console.log(onlineUsers.length, 'Users after connection')
            // console.log(socket.id)

            socket.on('joinRooms', async (payload)=>{
                const newOnlineUser={
                    loggedUserId: payload,
                    socketId: socket.id
                }
                onlineUsers.push(newOnlineUser)

                const chats = await Chat.find({
                    members: { $in: [payload] }})
                    socket.join(payload)
                    chats.forEach(chat=> {socket.join(chat._id.toString())
                    })
                
                })

        socket.on("example", socketHandlers.example)

        socket.on("createRoom",async (payload) => {
            const newChat = new Chat({members: payload})
            const newlyCreatedRoom = await newChat.save({new: true})
            const room = newlyCreatedRoom._id
            const newRoomPopulated = await Chat.findById(room)
            .populate('members')

            // console.log(onlineUsers)
            // console.log(payload, '<<<<<<<payload')
            // const receiver = onlineUsers.filter(onlineUser=> onlineUser.loggedUserId === payload[0])[0]
            // console.log(receiver)
            // socket.connected[receiver.socketId].join(room.toString());
            
            socket.join(room.toString())
            socket.emit("roomCreated", newRoomPopulated)
            console.log(onlineUsers, 'From createRoom')
            // socket.to(room.toString()).emit("roomCreated", newRoomPopulated)
            socket.to(payload[0]).emit("roomCreated", newRoomPopulated)
        })

        socket.on('updateChatMessagesToTheReceiver', async (payload)=>{
            const updateChat = await Chat.findById(payload)
        
            socket.to(updateChat._id.toString()).emit('sendAllChatMessages', updatedChat)

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
            socket.emit('UpdateChatHistory', saveMessage) //for the sender
            socket.to(roomId).emit('UpdateChatHistory', saveMessage) //for the receiver
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
            onlineUsers.filter(onlineUser=> onlineUser.socketId !== socket.id)
            console.log(onlineUsers.length, 'Users after DC')
        })
        
        })

        
    } catch (error) {
        console.log(error)
    }
}