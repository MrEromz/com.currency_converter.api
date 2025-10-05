import { Router } from 'express'
import {
    login,
    logout
} from './controllers/sessionController'

const router = Router()

router.route('/v1/session')
    .post(login)
    .delete(logout)

export default router