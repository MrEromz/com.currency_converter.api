import { Router } from 'express'
import {
    login,
    logout
} from './controllers/sessionController'

const router = Router()

router.route('/session/login')
    .get(login)
router.route('/session/logout').get(logout)

export default router