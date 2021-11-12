import express from 'express';
import { UsersService } from '../../users/services/users.service';
import argon2 from 'argon2';

const usersService = UsersService.getInstance();

export class AuthMiddleware {
    private static instance: AuthMiddleware;

    static getInstance() {
        if (!AuthMiddleware.instance) {
            AuthMiddleware.instance = new AuthMiddleware();
        }
        return AuthMiddleware.instance;
    }

    validateBodyRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({ error: 'Missing body fields: email, password' });
        }
    }

    verifyUserPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user: any = await usersService.getUserByEmail(req.body.email);
        if (user) {
            let passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user.id,
                    email: user.email,
                    provider: 'email',
                    permissionLevel: user.permissionLevel,
                };
                return next();
            } else {
                res.status(400).send({ errors: `Invalid email and/or password` });
            }
        } else {
            res.status(400).send({ errors: `Invalid email and/or password` });
        }
    }
}