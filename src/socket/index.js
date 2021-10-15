import { Server } from 'socket.io'
import { createServer } from 'http';
import socketHandlers from './socket-handlers.js';
import express from "express"
import Chat from '../DB/Schema/Chat.js'
import Message from '../DB/Schema/Message.js'
import Users from '../DB/Schema/User.js'
import { join } from 'path';
import { httpServer } from '../server/listen.js'

// import { server } from '../server/index.js';
// export const httpServer = createServer(server)


let onlineUsers = []

export const connectSocket = (server) => {
    try {
        // const httpServer = createServer(server)
        const io = new Server(httpServer, { allowEIO3: true })
        // httpServer.listen(process.env.PORT, () => {
        //     console.log(`Server listening on port ${process.env.PORT}`)
        // })
        io.on('connection', socket => {

            socket.on('joinPreExistingRooms', async (payload) => {
                console.log(payload, 'User Log in, should show USER ID on LOGIN')
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

                const isGroup = payload.length > 2 ? true : false
                console.log(isGroup, 'is group value')

                const existentRoom = async () => {
                    if (isGroup) {
                        const existentRoom = await Chat.find({ members: { $all: payload } })
                        if (existentRoom.length > 0) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        const existentRoom = await Chat.find({ members: { $all: payload } })
                        console.log(existentRoom.length, 'Existent room size, 2 members')
                        if (existentRoom.length > 0) {
                            console.log('inside of true')
                            return true
                        } else {
                            console.log('inside of false')
                            return false
                        }
                    }
                }

                if (await existentRoom()) {
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
                    console.log(payload)
                    if (payload.length > 2) {
                        const filteredUsers = payload.filter(userID => userID !== payload[0])
                        const receiversOn = onlineUsers.filter(onlineUser => filteredUsers.includes(onlineUser.loggedUserId))
                        // console.log(receiversOn, 'list with all online users from group creation')
                        if (receiversOn.length >= 1) {

                            socket.emit('NewRoomCreated', newRoomPopulated)
                            // console.log(receiversOn, 'List of receivers on')
                            receiversOn.forEach(onlineUser => socket.broadcast.to(onlineUser.loggedUserId).emit('NewRoomCreated', newRoomPopulated))
                            return
                        } else {
                            socket.emit('NewRoomCreated', newRoomPopulated)
                        }
                    } else {
                        const receiverOn = onlineUsers.find(onlineUser => onlineUser.loggedUserId === payload[0].toString())
                        if (receiverOn) {
                            socket.emit('NewRoomCreated', newRoomPopulated)
                            return socket.broadcast.to(receiverOn.loggedUserId).emit('NewRoomCreated', newRoomPopulated)
                        } else {
                            socket.emit('NewRoomCreated', newRoomPopulated)
                        }
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
                        socket.to(roomId).emit('UpdateChatHistory', {roomId, saveMessage}) //for the receiver
                    }

                } catch (error) {
                    console.log(error)
                }

            })

            socket.on("connectToSelectedRoom", async (payload) => {
                socket.join(payload)
                const currentChat = await Chat.findById(payload).populate('history').populate('members')
                
                if (currentChat) {
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