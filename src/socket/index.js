import { Server } from 'socket.io'
import { createServer } from 'http';
import socketHandlers from './socket-handlers.js';
import express from "express"
import Chat from '../DB/Schema/Chat.js'
import Message from '../DB/Schema/Message.js'
import dotenv from 'dotenv'
import Users from '../DB/Schema/User.js'
import { join } from 'path';
dotenv.config()



let onlineUsers = []

export const connectSocket = (server) => {
    try {
        const httpServer = createServer(server)
        const io = new Server(httpServer, { allowEIO3: true })
        httpServer.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`)
        })
        io.on('connection', socket => {

            socket.on('joinPreExistingRooms', async (payload) => {
                const newOnlineUser = {
                    loggedUserId: payload.toString(),
                    socketId: socket.id
                }
                onlineUsers.push(newOnlineUser)
                const chats = await Chat.find({ members: { $in: [payload] } })
                chats.forEach(chat => {
                    socket.join(chat._id.toString())
                })
                socket.join(payload.toString())
            })

            socket.on("createRoom", async (payload) => {

                const existentRoom = await Chat.find({ members: { $all: payload } })
                if (existentRoom.length > 0) {
                    return socket.emit('existentRoom')
                } else {
                    const newChat = new Chat({ members: payload })
                    const newlyCreatedRoom = await newChat.save({ new: true })
                    const roomID = newlyCreatedRoom._id.toString()
                    const newRoomPopulated = await Chat.findById(roomID)
                        .populate('members')
                    // Join room for sender
                    socket.join(roomID)                 
                    //Join room for receiver
                    const receiverOn = onlineUsers.find(onlineUser => onlineUser.loggedUserId === payload[0].toString())
                    if(receiverOn){
                        socket.emit('NewRoomCreated', newRoomPopulated)
                        return socket.broadcast.to(receiverOn.loggedUserId).emit('NewRoomCreated',newRoomPopulated)
                    } else {
                        socket.emit('NewRoomCreated', newRoomPopulated)
                    }      
                }
            })

            socket.on("newMessage", async (payload) => {
                try {
                    const { message, userId, roomId } = payload
                    const messageObject = {
                        sender: userId,
                        content: {
                            text: message,
                        }
                    }
                    const newMessage = new Message(messageObject)
                    const saveMessage = await newMessage.save({ new: true })
                    if (saveMessage) {
                        const newMessageId = saveMessage._id.toString()
                        const updateChat = await Chat.findByIdAndUpdate(roomId, { $push: { history: newMessageId } }, { new: true })
                        // socket.to().emit('UpdateChatHistory', saveMessage) //for the sender
                        socket.to(roomId).emit('UpdateChatHistory', saveMessage) //for the receiver
                    }

                } catch (error) {
                    console.log(error)
                }

            })

            socket.on("connectToSelectedRoom", async (payload)=>{
                socket.join(payload)
                const currentChat = await Chat.findById(payload).populate('history').populate('members')
                console.log(currentChat, '<<<<<<')
                if(currentChat){
                    socket.emit('updateChatRoom', currentChat)
                }

            })

            socket.on("deleteMessage", async (payload) => {
                const { roomId, messageId } = payload
                try {
                    const updateChat = await Chat.findByIdAndUpdate(roomId, { $pull: { history: messageId } }, { new: true })
                    const deleteFromMessage = await Message.findByIdAndDelete(messageId)
                    socket.emit('UpdateChatHistory', updateChat)

                } catch (error) {
                    console.log(error)
                }


            })

            socket.on('forceDisconnect', () => {
                onlineUsers = onlineUsers.filter(onlineUser => onlineUser.socketId !== socket.id)
                console.log(onlineUsers.length, 'from forceDC')

            })
            socket.on("disconnect", () => {
                onlineUsers = onlineUsers.filter(onlineUser => onlineUser.socketId !== socket.id)
                console.log(onlineUsers.length, 'from disconnect')
            })

        })


    } catch (error) {
        console.log(error)
    }
}