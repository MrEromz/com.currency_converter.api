import { Request, Response } from 'express';
import { BaseController } from './baseController';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import {SignUp, Login} from "../validation/validation";
import {z} from "zod";

class SessionController extends BaseController {
    private saltRounds: number = 8
    private validationErrorMsg: string = 'Ooops something went wrong'

    
    /**
     * Authenticates a user with email and password credentials.
     * Validates input data, verifies credentials, and generates a JWT token upon successful login.
     *
     * @param _req Express Request object containing email and password in the body
     * @param _res Express Response object used to send back the JWT token or error messages
     */
    public login = async (_req: Request, _res: Response) => {
        try {
            const {email, password} = _req.body;

            const validatedParams = Login.parse({email: email, password: password})

            const user = await this.prisma.authUser.findUnique({where: {email}});

            if (!user) {
                return this.json(_res, 401, {message: 'Invalid credentials'});
            }

            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                return this.json(_res, 401, {message: 'Invalid credentials'});
            }

            const token = jsonwebtoken.sign({id: user.id}, process.env.JWT_SECRET!, {
                expiresIn: '2h',
            });

            return this.ok(_res, {token});
        } catch (error) {
            if (error instanceof z.ZodError) {
                this.validationErrorMsg = error.issues[0].message
            }

            return this.json(_res, 409, {message: this.validationErrorMsg})
        }
    };


    /**
     * Creates a new user account with the provided email, password, and profile information.
     * Validates input data, checks for existing users, and generates a JWT token upon successful registration.
     *
     * @param _req Express Request object containing email, password, firstname, and lastname in the body
     * @param _res Express Response object used to send back the JWT token or error messages
     */
    public signup = async (_req: Request, _res: Response) => {
        try {
            const {email, password, firstname, lastname} = _req.body;

            const validatedParams = SignUp.parse({
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            })

            const existingUser = await this.prisma.authUser.findUnique({where: {email}});

            if (existingUser) {
                return this.json(_res, 409, {message: 'User with this email already exists'});
            }

            const passwordHash = await bcrypt.hash(password, this.saltRounds);

            const newUser = await this.prisma.authUser.create({
                data: {
                    email,
                    password_hash: passwordHash,
                    profile: {
                        create: {
                            firstname: 'Olumide',
                            lastname: 'Adeyemo'
                        }
                    }
                },
            });

            const token = jsonwebtoken.sign({id: newUser.id}, process.env.JWT_SECRET!, {
                expiresIn: '7d',
            });

            return this.ok(_res, {token});
        } catch (error) {
            if (error instanceof z.ZodError) {
                this.validationErrorMsg = error.issues[0].message
            }

            return this.json(_res, 409, {message: this.validationErrorMsg})
        }
    };

    /**
     * Handles user logout by returning a success message.
     * Note: Token invalidation is handled on the frontend by removing the token.
     * The tokens are short-lived (2 hours) as an additional security measure.
     *
     * FIXME : tokens are short lived for about 2hrs but the advantage is that it would be removed on the frontend to
     * @param _req Express Request object
     * @param _res Express Response object used to send back the success message
     */
    public logout = async (_req: Request, _res: Response) => {
        this.json(_res, 200, {message: 'Logout successful'});
  };
}

const sessionController = new SessionController();
export const login = sessionController.login;
export const signup = sessionController.signup;
export const logout = sessionController.logout;