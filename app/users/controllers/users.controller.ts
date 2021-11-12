import {
    Request,
    Response
} from 'express';
import { UsersService } from '../services/users.service';
import * as argon2 from 'argon2';

const usersService = UsersService.getInstance();

export class UsersController {
    listUsers = (req: Request, res: Response) => {
        const users = usersService.list(100, 0);
        res.status(200).send(users);
    };

    getUserById = (req: Request, res: Response) => {
        const user = usersService.readById(req.params.userId);
        res.status(200).send(user);
    };

    createUser = async (req: Request, res: Response) => {
        req.body.password = await argon2.hash(req.body.password) as unknown as string;
        req.body.permissionLevel = 1 + 2 + 4 + 8;
        const userId = await usersService.create(req.body);
        res.status(200).send({ 
            id: userId,
            message: `Created user id: ${req.body.username}`
        });
    };

    patch = (req: Request, res: Response) => {
        usersService.patchById(req.body);
        res.status(200).send({ message: `Successfully patched to user ${req.params.userId}` });
    };

    put = (req: Request, res: Response) => {
        usersService.updateById(req.body);
        res.status(200).send({ message: `Successfully put to user ${req.params.userId}` });
    };

    removeUser = (req: Request, res: Response) => {
        usersService.deleteById(req.params.userId);
        res.status(200).send({ message: `Successfully deleted user ${req.params.userId}` });
    };
}