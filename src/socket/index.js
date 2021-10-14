import { Server } from 'socket.io'
import { createServer } from 'http';
import socketHandlers from './socket-handlers.js';
import express from "express"
import Chat from '../DB/Schema/Chat.js'
import Message from '../DB/Schema/Message.js'
import Users from '../DB/Schema/User.js'

const app = express()


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
                console.log(onlineUsers.length, 'Online on join')
            })

            // socket.on('joinRooms', async (payload) => {
            //     const newOnlineUser = {
            //         loggedUserId: payload,
            //         socketId: socket.id
            //     }
            //     onlineUsers.push(newOnlineUser)
            //     console.log(onlineUsers.length, 'Users join room')

            //     const chats = await Chat.find({
            //         members: { $in: [payload] }
            //     })
            //     socket.join(payload)
            //     chats.forEach(chat => {
            //         socket.join(chat._id.toString())
            //     })

            // })


            socket.on("createRoom", async (payload) => {

                const existentRoom = await Chat.find({ members: { $all: payload } })
                if (existentRoom.length > 0) {
                    console.log('inside if existent room')
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
                    console.log(receiverOn.socketId, 'receiver socketID')
                    
                    socket.emit('NewRoomCreated', newRoomPopulated )
                    socket.to(receiverOn.loggedUserId).emit('NewRoomCreated',newRoomPopulated)
                }
            })

            // socket.on('updateChatMessagesToTheReceiver', async (payload) => {
            //     const updateChat = await Chat.findById(payload)

            //     socket.to(updateChat._id.toString()).emit('sendAllChatMessages', updatedChat)

            // })

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