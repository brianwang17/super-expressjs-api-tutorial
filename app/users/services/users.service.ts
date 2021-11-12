import { CRUD } from '../../common/interfaces/crud.interface';
import { GenericInMemoryDao } from '../daos/in.memory.dao';
import { UsersDao } from '../daos/users.dao';

export class UsersService implements CRUD {
    
    constructor() {
        this.dao = GenericInMemoryDao.getInstance();
        this.userDao = UsersDao.getInstance();
    }

    private static instance: UsersService;
    dao: GenericInMemoryDao;
    userDao: UsersDao;

    static getInstance = (): UsersService => {
        if (!UsersService.instance) {
            UsersService.instance = new UsersService();
        }

        return UsersService.instance;
    };

    create = async (resource: any): Promise<any> => {
        return await this.userDao.addUser(resource);
    };

    deleteById = async (resourceId: any): Promise<any> => {
        return await this.userDao.removeUserById(resourceId);
    };

    list = async (limit: number, page: number): Promise<any> => {
        return await this.userDao.listUsers();
    };

    patchById = async (resource: any): Promise<any> => {
        return await this.userDao.patchUserById(resource);
    };

    readById = async (resourceId: any): Promise<any> => {
        return await this.userDao.getUserById(resourceId);
    };

    updateById = async (resource: any): Promise<any> => {
        return await this.dao.putUserById(resource);
    };

    getUserByEmail = async (email: string): Promise<any> => {
        return await this.userDao.getUserByEmail(email);
    }
}