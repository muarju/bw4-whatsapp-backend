const example = (payload) => {
    // console.log(payload, 'From Example')
    //do what you want here
    //save, search emit, if/else 

    socket.emit("fromExample")
    socket.broadcast.emit("fromExample")
}
//create room
//sendMessage
//

const socketHandlers = {
    example:example
}

export default socketHandlers