import * as Mongoose from "mongoose";
import mongoose from "mongoose";




interface IUser extends Mongoose.Document {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    roles: string[];
}

export const schema = new Mongoose.Schema<IUser>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    roles: {type: [String], required: true}
});

const modelName = "User";
global.models[modelName] = global.models[modelName]|| mongoose.model<IUser>(modelName, schema);

export default { schema, model: global.models[modelName] };
export let model = global.models[modelName];