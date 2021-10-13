import express from "express"
import { tokenMiddleware } from "../../auth/tokenMiddleware.js"
import chats from "./chat-handlers.js"
import multer from 'multer'
import { saveToChat } from "../../lib/cloudinaryTool.js"

const router = express.Router()

router
  .route("/chatByUser")
  .get(tokenMiddleware, chats.getChatsbyUser)
  
  router
  .route("/imageUpload/:chatId")
  .put(tokenMiddleware, multer({ storage: saveToChat }).single("image"), chats.uploadImage)
  
router
  .route("/:chatId")
  .get(tokenMiddleware, chats.getSingleChat)
  .put(tokenMiddleware, chats.updateChat)
  .delete(tokenMiddleware, chats.deleteChat)


export default router
