import { Server } from 'socket.io'
import { createServer } from 'http';
import socketHandlers from './socket-handlers.js';




export const connectSocket = (server) => {
    try {
        const httpServer = createServer(server)
        const io = new Server(httpServer, { allowEIO3: true })
        httpServer.listen(process.env.PORT, () => {
            console.log("Server listening on port 3003")
        })





        io.on('connection', socket => {
            socket.on("example", socketHandlers.example)
        
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