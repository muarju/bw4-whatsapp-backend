import UserModel from '../../DB/Schema/User.js'
import {generateJWTToken} from '../../auth/tokenTools.js'

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
    res.status(200).send(token)
  } catch (error) {
    res.status(500)
    console.log(error)
    next(error)
  }
}

const getUserMe = async (req, res, next) => {
  try {
    console.log(req.user)
    await res.send(req.user)
  } catch (error) {
    next(error)
  }
}

const updateUserMe = async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(req.user._id,req.body,{new:true})
    res.send(updateUser)
  } catch (error) {
    next(error)
  }
}
const deleteUserMe= async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndDelete(req.user._id)
    res.send("deleted successfully")
  } catch (error) {
    next(error)
  }
}

const uploadAvatar = async(req, res, next) => {
  try {
    const imageUrl = req.file.path;
    console.log(imageUrl)
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
  } catch (error) {
    next(error)
  }
}

const checkLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      const token = await generateJWTToken(user)
      res.cookie("token", req.user.token, {
        httpOnly: true,
      })
      res.setHeader('Access-Control-Allow-Origin', process.env.FE_DEV_TRUST_URL);
      res.setHeader('Access-Control-Allow-Credentials',true);
      res.status(200).send(token)
    } else {
  
      next(createHttpError(401, "Credentials are not ok!"))
    }
  } catch (error) {
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