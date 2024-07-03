import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputDto } from '../api/dto/input/userInputDto';
import { UserViewDto } from '../api/dto/output/userViewDto';
import { CryptoService } from '../../../base/services/crypto.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async createUser(userBody: UserInputDto): Promise<UserViewDto> {
        //todo возвращать спец общий объект interlayer https://github.com/it-incubator/ed-back-lessons-nestjs/blob/lesson-1-nest-introdution/src/base/models/Interlayer.ts#L27
        const passHash = await this.cryptoService.createPasswordHash(
            userBody.password,
        );
        const confirmationCode = uuid();
        const createdUser = await this.usersRepository.createUser(
            userBody,
            passHash,
            confirmationCode,
        );
        return {
            id: String(createdUser._id),
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
        };
    }

    async deleteUser(userId: string) {
        return await this.usersRepository.deleteUser(userId);
    }
}
