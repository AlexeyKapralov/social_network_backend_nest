import { Injectable } from '@nestjs/common';
import { UserInputDto } from '../api/dto/input/userInputDto';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { RegistrationConfirmationCodeDto } from '../../auth/api/dto/input/registrationConfirmationCode.dto';


@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private userModel: UserModelType
    ) {}

    async createUser(userBody: UserInputDto, passHash: string, confirmationCode: string) {

        const user = this.userModel.createUser(userBody, passHash, confirmationCode)

        await user.save()
        return user
    }

    async deleteUser(userId: string) {

        const deletedUser = await this.userModel.updateOne({_id: userId}, {isDeleted: true})
        return deletedUser.modifiedCount > 0
    }
    async findUser(userId: string) {
        return this.userModel.findOne(
            { _id: userId, isDeleted: false }
        );
    }
    async findUserByLogin(login: string): Promise<UserDocument> {
        return this.userModel.findOne({ login: login });
    }

    async findUserByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email: email });
    }

    async findUserByEmailAndNotConfirmed(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email, isConfirmed: false });
    }

    async findUserByConfirmationCode(confirmationCode: string): Promise<UserDocument> {
        return this.userModel.findOne({ confirmationCode, isConfirmed: false });
    }

    async confirmUserRegistration(confirmationCode: RegistrationConfirmationCodeDto) {
        const isConfirmed = await this.userModel.updateOne({confirmationCode: confirmationCode.code}, {isConfirmed: true})
        return isConfirmed.modifiedCount > 0
    }

    async updateConfirmationCode(email: string, newConfirmationCode: string) {
        await this.userModel.updateOne({email: email}, {confirmationCode: newConfirmationCode, isConfirmed: false})
    }
}