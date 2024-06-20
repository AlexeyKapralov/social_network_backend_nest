import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserInputModel } from '../api/models/input/userInput.model';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
    ) {}

    findUser(term: string) {
        return this.usersRepository.findUser(term);
    }

    createUser(userBody: UserInputModel) {
        const createUser = this.usersRepository.createUser(userBody)
    }
}
