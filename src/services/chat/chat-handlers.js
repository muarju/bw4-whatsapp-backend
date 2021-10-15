import ChatModel from '../../DB/Schema/Chat.js'

const getChatsbyUser = async (req, res, next) => {
  try {
    const chats = await ChatModel.find({
        members: { $in: [req.user.id] }
    }).populate('members').populate('history')
    res.status(200).send(chats)
  } catch (error) {
    next(error)
  }
}

const getSingleChat = async (req, res, next) => {
    try {
      const chat = await ChatModel.findById(req.params.chatId)
      res.status(200).send(chat)
    } catch (error) {
      next(error)
    }
}


const updateChat = async (req, res, next) => {
    try {
      const updateChat = await ChatModel.findByIdAndUpdate(req.params.chatId,req.body,{new:true})
      res.send(updateChat)
    } catch (error) {
      next(error)
    }
  }

const uploadImage = async(req, res, next) => {
try {
    const imageUrl = req.file.path;
    
    const updateChat = await ChatModel.findByIdAndUpdate(
    req.params.chatId,
    { image: imageUrl },
    { new: true }
    )
    res.status(201).send(updateChat)
} catch (error) {
    next(error)
}
}

const deleteChat= async (req, res, next) => {
  try {
    const chat = await ChatModel.findByIdAndDelete(req.params.chatId)
    res.send("chat has been deleted successfully")
  } catch (error) {
    next(error)
  }
}

const chats = {
  getChatsbyUser: getChatsbyUser,
  getSingleChat: getSingleChat,
  deleteChat:deleteChat,
  updateChat:updateChat,
  uploadImage:uploadImage
}

export default chats