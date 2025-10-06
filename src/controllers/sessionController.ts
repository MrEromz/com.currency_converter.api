import { Request, Response } from 'express';
import { BaseController } from './baseController';


class SessionController extends BaseController {
    public login = async (_req: Request, res: Response) => {

    this.ok(res, { message: 'Login successful' });
  };

    public signup = async (_req: Request, _res: Response) => {
        // i need to get the information from the request object
    };

    public logout = async (_req: Request, res: Response) => {
    this.logger.info('Logout attempt');
    // In a real app, you would invalidate a session/token here
    this.ok(res, { message: 'Logout successful' });
  };
}

const sessionController = new SessionController();
export const login = sessionController.login;
export const signup = sessionController.signup;
export const logout = sessionController.logout;