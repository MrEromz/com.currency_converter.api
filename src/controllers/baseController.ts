import {Request, Response} from 'express';
import {Logger} from 'winston';
import loggerInstance from '../config/logger';

export abstract class BaseController {
    protected readonly logger: Logger;

    constructor() {
        this.logger = loggerInstance;
    }

    /**
     * Sends a JSON response.
     * @param res The Express response object.
     * @param code The HTTP status code.
     * @param dto The data transfer object or message to send.
     */
    protected json<T>(res: Response, code: number, dto?: T) {
        return res.status(code).json(dto);
    }

    /**
     * Sends a 200 OK response.
     * @param res The Express response object.
     * @param dto Optional data to send in the response body.
     */
    protected ok<T>(res: Response, dto?: T) {
        return this.json(res, 200, dto);
    }

    /**
     * Sends a 201 Created response.
     * @param res The Express response object.
     */
    protected created(res: Response) {
        return res.sendStatus(201);
    }
}