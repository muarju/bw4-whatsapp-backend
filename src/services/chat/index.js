import express from "express"
import { tokenMiddleware } from "../../auth/tokenMiddleware.js"
import chats from "./chat-handlers.js"
import multer from 'multer'
import { saveToChat } from "../../lib/cloudinaryTool.js"

const router = express.Router()

router
  .route("/:chatId")
  .get(tokenMiddleware, chats.getSingleChat)
  .put(tokenMiddleware, chats.updateChat)
  .delete(tokenMiddleware, chats.deleteChat)

router
  .route("/chatbyuser/:userId")
  .get(tokenMiddleware, chats.getChatsbyUser)
  
router
  .route("/imageUpload/:chatId")
  .get(tokenMiddleware, chats.uploadImage)

  .route("/imageUpload")
  .get(tokenMiddleware,multer({ storage: saveToChat }).single("cover"), chats.uploadImage)

export default router
