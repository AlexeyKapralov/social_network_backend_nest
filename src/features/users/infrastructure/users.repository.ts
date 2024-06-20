import { Injectable } from '@nestjs/common';
import { UserInputModel } from '../api/models/input/userInput.model';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType, UserStaticType } from '../domain/user.entity';
import mongoose from 'mongoose';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private userModel: UserModelType
    ) {}

    findUser(term: string){
        return [
            {id: 1, name: 'Alex'},
            {id: 2, name: 'Angela'}
        ].filter(i => !term || i.name.indexOf(term) > -1)
    }

    createUser(userBody: UserInputModel) {

        //todo как типизировать, можно ли подсунуть класс User, но у него просит методы, т.е. нужна dto скорее всего или нет?
        const user = {
            _id: new mongoose.Types.ObjectId(),
            email: userBody.email,
            createdAt: Date.now().toString(),
            login: userBody.login
        }

        const createdUser = new this.userModel(user)

        return createdUser.save()
    }
}