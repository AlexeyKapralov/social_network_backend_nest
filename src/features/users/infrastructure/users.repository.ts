import { Injectable } from '@nestjs/common';
import { UserInputDto } from '../api/dto/input/userInputDto';
import { User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { QueryDto } from '../../../common/dto/query.dto';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private userModel: UserModelType
    ) {}

    async createUser(userBody: UserInputDto) {

        //todo как типизировать, можно ли подсунуть класс User, но у него просит методы, т.е. нужна dto скорее всего или нет?
        //todo не нужно всё это создавать в модели или здесь норм?
        const user = {
            _id: new mongoose.Types.ObjectId(),
            email: userBody.email,
            createdAt: new Date().toISOString(),
            password: userBody.password,
            login: userBody.login,
            isDeleted: false
        }

        const createdUser = new this.userModel(user)

        await createdUser.save()
        return createdUser
    }

    async deleteUser(userId: string) {

        const deletedUser = await this.userModel.updateOne({_id: userId}, {isDeleted: true})
        return deletedUser.modifiedCount > 0
    }
    async findUser(userId: string) {
        return this.userModel.findOne(
            {_id: userId, isDeleted: false}
        )
    }
}