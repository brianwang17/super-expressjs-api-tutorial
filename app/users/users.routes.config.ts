import { Application } from 'express';
import {
    CommonRoutesConfig,
    configureRoutes
} from '../common/common.routes.config';
import { UsersController } from './controllers/users.controller';
import { UsersMiddleware } from './middleware/users.middleware';
import { routeResources } from '../shared/routeResources/routeResources';

const { usersRoot } = routeResources;

const usersController = new UsersController();
const usersMiddleware = UsersMiddleware.getInstance();

export class UsersRoutes extends CommonRoutesConfig implements configureRoutes {
    constructor(app: Application) {
        super(app, 'UsersRoute');
        this.configureRoutes();
    }

    configureRoutes = () => {

        this.app.get(`${usersRoot}`, [ usersController.listUsers ]);

        this.app.post(`${usersRoot}`, [
            usersMiddleware.validateRequiredCreateUserBodyFields,
            usersMiddleware.validateSameEmailDoesntExist,
            usersController.createUser
        ]);

        this.app.put(`${usersRoot}/:userId`, [
            usersMiddleware.validateUserExists,
            usersMiddleware.extractUserId,
            usersController.put
        ]);

        this.app.patch(`${usersRoot}/:userId`, [
            usersMiddleware.validateUserExists,
            usersMiddleware.extractUserId,
            usersController.patch
        ]);

        this.app.delete(`${usersRoot}/:userId`, [
            usersMiddleware.validateUserExists,
            usersMiddleware.extractUserId,
            usersController.removeUser
        ]);

        this.app.get(`${usersRoot}/:userId`, [
            usersMiddleware.validateUserExists,
            usersMiddleware.extractUserId,
            usersController.getUserById
        ]);
    }
}