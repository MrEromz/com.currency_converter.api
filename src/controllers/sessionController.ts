import { Request, Response } from 'express';
import { BaseController } from './baseController';

class SessionController extends BaseController {
  public login = (_req: Request, res: Response) => {
    this.logger.info('Login attempt');
    // In a real app, you would validate user credentials here
    this.ok(res, { message: 'Login successful' });
  };

  public logout = (_req: Request, res: Response) => {
    this.logger.info('Logout attempt');
    // In a real app, you would invalidate a session/token here
    this.ok(res, { message: 'Logout successful' });
  };
}

const sessionController = new SessionController();
export const login = sessionController.login;
export const logout = sessionController.logout;