import UserModel from '../../DB/Schema/User.js'

const getAll = async (req, res, next) => {
  try {
    const users = await UserModel.find({})
    res.status(200).send(users)
  } catch (error) {
    next(error)
  }
}
const getSingle = async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {

    const newUser = await UserModel(req.body).save()

    res.status(201).send(newUser)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
}

const deleteSingle = async (req, res, next) => {
  try {

  } catch (error) {

    next(error)
  }
}

const checkLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    console.log(email, password, 'From check login')
    const user = await User.checkCredentials(email, password)

    if (user) {
   
    

      res.send()
    } else {
  
      next(createHttpError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
}

const users = {
  create: create,
  getAll: getAll,
  getSingle: getSingle,
  update: update,
  deleteSingle: deleteSingle,
  Login:checkLogin,
}

export default users