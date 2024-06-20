import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { UserInputModel } from '../api/models/input/userInput.model';

@Schema()
export class User {
    _id: mongoose.ObjectId

    @Prop({
        required: true,
        maxlength: 10,
        minlength: 3
    })
    login: string;

    @Prop({
        required: true,
        match: /^[a-z0-9]+$/,

    })
    email: string;
    
    @Prop({
        required: true,
        minlength: 6,
        maxlength: 20
    })
    password: string;

    setLogin(newLogin: string) {
        this.login = newLogin
    }

    static createUser(userBody: UserInputModel) {
        // const user = {
        //     email: userBody.email,
        //     createdAt: Date.now().toString(),
        //     login: userBody.login
        // }
        // new User(user)
        return true
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
    setLogin: User.prototype.setLogin
}

export type UserStaticType = {
    createUser: () => boolean
}

export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<UserDocument> & UserStaticType