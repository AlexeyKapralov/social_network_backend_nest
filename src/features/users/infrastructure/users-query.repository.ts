import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserViewDto } from '../api/dto/output/user-view.dto';

@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectModel(User.name) private userModel: UserModelType,
    ) {
    }

    async findUserById(userId: string): Promise<UserViewDto> {

        const user: UserViewDto = await this.userModel.findById(userId, {
            _id: 0,
            id: { $toString: '$_id' },
            email: 1,
            login: 1,
            createdAt: 1,
        });

        return user;
    }

}