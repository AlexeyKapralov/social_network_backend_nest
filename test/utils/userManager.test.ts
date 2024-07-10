import { HttpStatus, INestApplication } from '@nestjs/common';
import { agent as request, agent } from 'supertest';
import { UserInputDto } from '../../src/features/users/api/dto/input/user-input.dto';
import { UserViewDto } from '../../src/features/users/api/dto/output/user-view.dto';

export class UserManagerTest {
    constructor(protected readonly app: INestApplication) {
    }

    async createUser(userBody: UserInputDto): Promise<UserViewDto> {
        const user =  await request(this.app.getHttpServer())
            .post('/users')
            .send(userBody)
            .expect(HttpStatus.CREATED)
        return user.body
    }

}