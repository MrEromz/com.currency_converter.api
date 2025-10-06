import {Router} from 'express';
import rateLimit from 'express-rate-limit';
import {expressjwt as jwt} from 'express-jwt';
import {
    login,
    logout,
    signup
} from './controllers/sessionController';
import {errorHandler} from './middleware/errorHandler';

const router = Router();

// Rate limiter for login attempts to prevent brute-force attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 10 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

const requireAuth = jwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ['HS256'],
});

// Public login route
router.get('/session/login', loginLimiter, login);

// Protected logout route
router.get('/session/logout', requireAuth, logout);

router.post('/signup', requireAuth, signup);

// Custom error handling middleware
router.use(errorHandler);

export default router;
