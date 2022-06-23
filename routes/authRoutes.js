import express from 'express'
import { register, login, logout } from '../controller/authController.js'
import { handleRefreshToken } from '../controller/refreshtoken.js'
const router = express.Router()


router.route('/register').post(register)
router.route('/login').post(login);
router.route('/refresh').get(handleRefreshToken)
router.route('/logout').get(logout)

export default router