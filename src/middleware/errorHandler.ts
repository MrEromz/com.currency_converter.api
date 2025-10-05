import { Request, Response, NextFunction } from 'express'
import logger from "../config/logger";

export class AppError extends Error {
    statusCode: number
    status: string

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    }
}

export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    _res: Response
) => {
    if (err instanceof AppError) {
        return _res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }

    logger.error('Error:', err.stack || err)
    return _res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Oops something went wrong',
    })
}