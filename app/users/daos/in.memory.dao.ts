import * as shortUUID from 'short-uuid';

export class GenericInMemoryDao {
    
    constructor() {
        console.log('Created new instance of GenericInMemoryDao');
    }
    
    private static instance: GenericInMemoryDao;
    users: Array<any> = [];

    static getInstance = (): GenericInMemoryDao => {
        if (!GenericInMemoryDao.instance) {
            GenericInMemoryDao.instance = new GenericInMemoryDao();
        }

        return GenericInMemoryDao.instance;
    };

    addUser = (user: any) => {
        // return this.users.push(user);
        return new Promise((resolve) => {
            user.id = shortUUID.generate();
            this.users.push(user);
            resolve(user.id);
        })
    };

    getUsers = () => {
        return this.users;
    };

    getUserById = (userId: string) => {
        return this.users.find((user: { username: string }) => user.username === userId);
    };

    putUserById = (user: any) => {
        const objIndex = this.users.findIndex((obj: { username: any; }) => obj.username === user.username);

        const updatedUsers = [
            ...this.users.slice(0, objIndex + 1),
            user,
            ...this.users.slice(objIndex + 1)
        ];

        this.users = updatedUsers;
        return `${user.username} updated via put`;
    };

    patchUserById = (user: any) => {
        const objIndex = this.users.findIndex((obj: { username: any; }) => obj.username === user.username);

        let currentUser = this.users[objIndex];

        for (let i in user) {
            if (i !== 'username') {
                currentUser[i] = user[i];
            }
        }

        this.users = [
            ...this.users.slice(0, objIndex),
            currentUser,
            ...this.users.slice(objIndex + 1)
        ];

        return `${user.username} patched`;
    };

    removeUserById = (userId: string) => {
        const objIndex = this.users.findIndex((obj: { username: any }) => obj.username === userId);

        this.users.splice(objIndex, 1);
        return `${userId} removed`;
    };

    getUserByEmail = (email: string) => {
        return new Promise((resolve) => {
            const objIndex = this.users.findIndex((obj: { email: any; }) => obj.email === email);

            let currentUser = this.users[objIndex];
            if (currentUser) {
                resolve(currentUser);
            } else {
                resolve(null);
            }
        });
    }
}