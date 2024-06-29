import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { UserInputDto } from '../api/dto/input/userInputDto';

@Schema()
export class User {
    _id: mongoose.ObjectId

    @Prop()
    login: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    createdAt: string;

    @Prop( )
    isDeleted: boolean

    setLogin(newLogin: string) {
        this.login = newLogin
    }

    static createUser(userBody: UserInputDto) {
        // const user = {
        //     email: userBody.email,
        //     createdAt: new Date().toISOString(),
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