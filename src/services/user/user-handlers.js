import UserModel from '../../DB/Schema/User.js'
import { saveToUser } from '../../lib/cloudinaryTool.js'
import multer from 'multer'
import {generateJWTToken} from '../../auth/tokenTools.js'
import createHttpError from 'http-errors'


const cookieAge = 48 * 60 * 60 * 1000

const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({})
    res.status(200).send(users)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const user = await newUser.save({new: true})
    const token = await generateJWTToken(user)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: cookieAge
    })
    res.status(201).send(token)
  } catch (error) {
    res.status(500)
    console.log(error)
    next(error)
  }
}

const getUserMe = async (req, res, next) => {
  try {
    res.send(req.user)
    res.status(200)
  } catch (error) {
    res.status(404)
    next(error)
  }
}

const updateUserMe = async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(req.user._id,req.body,{new:true})
    res.status(200).send(updateUser)
  } catch (error) {
    next(error)
  }
}
const deleteUserMe= async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndDelete(req.user._id)
    res.status(204).send('deleted')
  } catch (error) {
    next(error)
  }
}

const uploadAvatar = async(req, res, next) => {
  try {
    const imageUrl = req.file.path;
   
    const updateUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { avatar: imageUrl },
      { new: true }
    )
    res.status(201).send(updateUser)
  } catch (error) {
    next(error)
  }
}

const getOneUser = async (req, res, next) => {
  try {
    const oneUser = await UserModel.findById(req.params.userId)
    res.status(200).send(oneUser)
  } catch (error) {
    res.status(404)
    next(error)
  }
}

const checkLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)
    
    if (user) {
      const token = await generateJWTToken(user)
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: cookieAge
      })
      res.status(200).send(token)
    } else {
  
      next(createHttpError(500, "Credentials are not ok!"))
    }
  } catch (error) {
    res.status(500)
    next(error)
  }
}

const users = {
  create: create,
  getAll: getUsers,
  getOneUser:getOneUser,
  getUserMe: getUserMe,
  updateUserMe: updateUserMe,
  deleteUserMe: deleteUserMe,
  uploadAvatar:uploadAvatar,
  Login:checkLogin,
}

export default users