import UserModel from '../../DB/Schema/User.js'

const getUsers = async (req, res, next) => {
  try {
     const users = await UserModel.find()
     res.status(200).send(users)
  } catch (error) {
    next(error)
  }
}
const getUserMe = async (req, res, next) => {
  try {
    res.send(req.user)
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
    res.send(updateUser.id,"has been deleted successfully")
  } catch (error) {
    next(error)
  }
}

const uploadAvatar = async (req, res, next) => {
  try {
      
      const newUser = await UserModel(req.body).save()

    res.status(201).send(newUser)
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





const users = {
  getUsers:getUsers,
  getUserMe:getUserMe,
  updateUserMe,updateUserMe,
  uploadAvatar:uploadAvatar,
  getOneUser:getOneUser,
  deleteUserMe:deleteUserMe
}

export default users