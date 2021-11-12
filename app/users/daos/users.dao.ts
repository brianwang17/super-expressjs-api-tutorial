import { MongooseService } from '../../common/services/mongoose.service';
import * as shortUUID from 'short-uuid';

const mongooseService: MongooseService = MongooseService.getInstance();

export class UsersDao {
    private static instance: UsersDao;

    Schema = mongooseService.getMongoose().Schema;

    userSchema = new this.Schema({
        _id: String,
        name: String,
        email: String,
        description: String,
        password: String,
        permissionLevel: Number
    });

    User = mongooseService.getMongoose().model('Users', this.userSchema);

    constructor() { }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UsersDao();
        }
        return this.instance;
    }

    addUser = async (userFields: any) => {
        userFields._id = shortUUID.generate();
        const user = new this.User(userFields);
        await user.save();
        return userFields._id;
    };

    getUserByEmail = (email: string) => {
        return this.User.findOne({ email: email });
    };

    removeUserById = async (userId: string) => {
        await this.User.deleteOne({ _id: userId });
    };

    getUserById = async (userId: string) => {
        await this.User.updateOne({ _id: userId });
    };

    listUsers = async (limit: number = 25, page: number = 0) => {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    };

    patchUserById = async (userFields: any) => {
        let user: any = await this.User.findById(userFields._id);
        if (user) {
            for (let i in userFields) {
                user[i] = userFields[i];
            }
            return await user.save();
        }
    }
}