import UserModel from '../../DB/Schema/User.js'

const getAll = async (req, res, next) => {
  try {
    res.status(200).send('insidegetAll')
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


const users = {
  create: create,
  getAll: getAll,
  getSingle: getSingle,
  update: update,
  deleteSingle: deleteSingle,

}

export default users