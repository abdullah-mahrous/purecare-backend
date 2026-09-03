import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import envVars from '../config/environment';
import { appError } from '../utilities/appError';
import { UserPayload } from '../types/express';

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try {
        // getting token and removing Bearer
        const authorization = req.headers.authorization;
        const token = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;

        if(!token)
            return next(new appError("No token provided. Please login.", 401));

        req.user = jwt.verify(token, envVars.jwt.secret) as UserPayload;
        next();
        
    } catch(err: any) {
        if(err.name == 'TokenExpiredError')
            return next(new appError('Token has expired. Please login again.', 401));

        if(err.name == 'JsonWebTokenError')
            return next(new appError('Invalid token.', 401));

        next(err);
    }
}

export default authMiddleware;