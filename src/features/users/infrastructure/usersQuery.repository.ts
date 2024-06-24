import { Injectable } from '@nestjs/common';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { QueryDto } from '../../../common/dto/query.dto';
import { Paginator } from '../../../common/dto/paginator.dto';
import { UserViewDto } from '../api/dto/output/userViewDto';

@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectModel(User.name) private userModel: UserModelType,
    ) {
    }

    // async findUsers(query: Omit<QueryDto, 'searchNameTerm'>): Promise<Paginator<UserViewDto | null>> {
    async findUsers(query: Omit<QueryDto, 'searchNameTerm'>) {
        const countUsers = await this.userModel.find(
            {
                $and: [
                    { isDeleted: false },
                    {
                        $or: [

                            { email: { $regex: query.searchEmailTerm || '', $options: 'i' } },
                            { login: { $regex: query.searchLoginTerm || '', $options: 'i' } },
                        ],
                    },
                ],
            }
        ).countDocuments()
        const users: UserViewDto[] = await this.userModel.aggregate([
            {
                $match: {
                    $and: [
                        { isDeleted: false },
                        {
                            $or: [

                                { email: { $regex: query.searchEmailTerm || '', $options: 'i' } },
                                { login: { $regex: query.searchLoginTerm || '', $options: 'i' } },
                            ],
                        },
                    ],
                },
            },
            { $sort: { [query.sortBy]: query.sortDirection as 1 | -1 } },
            { $skip: (query.pageNumber - 1) * query.pageSize },
            {
                $project: {
                    _id: 0,
                    id: { $toString: '$_id' },
                    email: 1,
                    login: 1,
                    createdAt: 1,
                },
            },
            { $limit: query.pageSize },
        ]).exec();

        const usersWithPaginate: Paginator<UserViewDto> = {
            pagesCount: Math.ceil(countUsers / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: countUsers,
            items: users,
        };

        return usersWithPaginate;
    }

}