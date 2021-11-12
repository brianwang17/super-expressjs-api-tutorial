import express from 'express';
import { UsersService } from '../services/users.service';

const usersService = UsersService.getInstance();

export class UsersMiddleware {
    private static instance: UsersMiddleware;

    static getInstance() {
        if (!UsersMiddleware.instance) {
            UsersMiddleware.instance = new UsersMiddleware();
        }
        return UsersMiddleware.instance;
    }

    validateRequiredCreateUserBodyFields = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.body && req.body.username && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({ error: `Missing required fields, email and password `});
        }
    };

    validateSameEmailDoesntExist = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user = await usersService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({ error: `User email already exists` });
        } else {
            next();
        }
    };

    validateUserExists = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user = await usersService.readById(req.params.userId);
        if (user) {
            next();
        } else {
            res.status(400).send({ error: `User ${req.params.userId} not found`});
        }
    };

    extractUserId = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.body.id = req.params.userId;
        next();
    };
}