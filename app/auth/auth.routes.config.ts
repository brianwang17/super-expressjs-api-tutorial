import { CommonRoutesConfig , configureRoutes } from '../common/common.routes.config';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import express from 'express';
import { routeResources } from '../shared/routeResources/routeResources';

const {authRoot, authRefreshToken } = routeResources;

export class AuthRoutes extends CommonRoutesConfig implements configureRoutes {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
        this.configureRoutes();
    }

    configureRoutes() {
        const authController = new AuthController();
        const authMiddleware = AuthMiddleware.getInstance();
        const jwtMiddleware = JwtMiddleware.getInstance();

        this.app.post(`${authRoot}`, [
            authMiddleware.validateBodyRequest,
            authMiddleware.verifyUserPassword,
            authController.createJWT
        ]);

        this.app.post(`${authRefreshToken}`, [
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.validRefreshNeeded,
            authController.createJWT
        ]);
    }
}