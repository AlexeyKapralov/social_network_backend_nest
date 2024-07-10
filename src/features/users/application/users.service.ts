import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputDto } from '../api/dto/input/user-input.dto';
import { UserViewDto } from '../api/dto/output/user-view.dto';
import { CryptoService } from '../../../base/services/crypto.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
    ) {}

    async deleteUser(userId: string) {
        return await this.usersRepository.deleteUser(userId);
    }
}
