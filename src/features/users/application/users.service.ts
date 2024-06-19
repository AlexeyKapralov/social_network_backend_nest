import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
    constructor(protected usersRepository: UsersRepository) {
    }

    findUser(term:string){
        return this.usersRepository.findUser(term);
    }
}