import express from 'express';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

// TODO: Remove me -- passed by config
const jwtSecret  = 'secret1!';

export class JwtMiddleware {
    private static instance: JwtMiddleware;

    static getInstance() {
        if (!JwtMiddleware.instance) {
            JwtMiddleware.instance = new JwtMiddleware();
        }
        return JwtMiddleware.instance;
    }

    verifyRefreshBodyField(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.cookies.refreshToken) {
            return next();
        } else {
            return res.status(400).send({ error: 'Missing cookie: refreshToken' });
        }
    };

    validRefreshNeeded(req: express.Request | any, res: express.Response, next: express.NextFunction) {
        if (!req.cookies.refreshToken) {
            return res.status(400).send({ error: 'Missing cookie: refreshToken' });
        }
        let buffer: Buffer = Buffer.from(req.cookies.refreshToken, 'base64');
        let refreshToken: string = buffer.toString();
        let hash: string = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + jwtSecret).digest('base64');
        if (hash === refreshToken) {
            delete req.jwt.iat;
            delete req.jwt.exp;
            req.body = req.jwt;
            return next();
        } else {
            return res.status(400).send({ error: 'Invalid refresh token provided' });
        }
    };

    validJWTNeeded(req: express.Request | any, res: express.Response, next: express.NextFunction) {
        if (req.headers.authorization) {
            if (!req.cookies.refreshToken) {
                return res.status(400).send({ error: 'Missing body field: refreshToken' });
            }
            try {
                let authorization = req.headers.authorization.split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    req.jwt = jwt.verify(authorization[1], jwtSecret);
                    next();
                }
            } catch(err) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }
    }
}