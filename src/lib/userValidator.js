import { body } from "express-validator";

export const userValidator = [
    body('name').exists().isString().withMessage('Name must exist!'),
    body('email').exists().isString().withMessage('Not a valid Email'),
    body('password').exists().isNumeric().withMessage('Password must exist!'),
    body('bio').exists().isString().withMessage('Bio must exist')

]
