import express from 'express';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

// todo: move to a secure place
const jwtSecret = 'secret1!';
const tokenExpirationInSeconds = 36000;

export class AuthController {
    constructor() { }

    async createJWT(req: express.Request, res: express.Response) {
        try {
            let refreshId: string = req.body.userId + jwtSecret;
            let salt: string = crypto.randomBytes(16).toString('base64');
            let hash: string = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
            req.body.refreshKey = salt;
            let token: string = jwt.sign(req.body, jwtSecret, { expiresIn: tokenExpirationInSeconds });
            let buffer: Buffer = Buffer.from(hash);
            let refreshToken: string = buffer.toString('base64');
            return res.status(201).send({ accessToken: token, refreshToken: refreshToken });
        } catch(err) {
            return res.status(500).send(err);
        }
    }
}