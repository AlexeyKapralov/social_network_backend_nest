import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
    findUser(term: string){
        return [
            {id: 1, name: 'Alex'},
            {id: 2, name: 'Angela'}
        ].filter(i => !term || i.name.indexOf(term) > -1)
    }
}