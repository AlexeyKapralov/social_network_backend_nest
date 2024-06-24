import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputDto } from '../api/dto/input/userInputDto';
import { UserViewDto } from '../api/dto/output/userViewDto';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
    ) {}

    async createUser(userBody: UserInputDto): Promise<UserViewDto> {
        //todo возвращать спец общий объект interlayer https://github.com/it-incubator/ed-back-lessons-nestjs/blob/lesson-1-nest-introdution/src/base/models/Interlayer.ts#L27
        const createdUser = await this.usersRepository.createUser(userBody)
        return {
            id: String(createdUser._id),
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
        }
    }
    async deleteUser(userId: string) {
        return await this.usersRepository.deleteUser(userId)
    }
}
