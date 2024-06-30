import { Body, Controller, Delete, Get, HttpStatus, Param, ParseArrayPipe, Post, Req, Res } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserInputDto } from './dto/input/userInputDto';
import { Request, Response } from 'express';
import { QueryDto } from '../../../common/dto/query.dto';
import { UsersQueryRepository } from '../infrastructure/usersQuery.repository';
import { IsUserExistPipe } from '../../../common/pipes/isUserExist.pipe';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersQueryRepository: UsersQueryRepository
    ) {}

    @Get()
    async getUsers(
        @Req() req: Request<{}, {}, {}, QueryDto>
    ) {
        let sortDirection
        if (req.query.sortDirection === 'asc') {
            sortDirection = 1
        }
        if (req.query.sortDirection === 'desc') {
            sortDirection = -1
        }

        const query: Omit<QueryDto, 'searchNameTerm'> = {
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: sortDirection || -1,
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            searchEmailTerm: req.query.searchEmailTerm || null,
            searchLoginTerm: req.query.searchLoginTerm || null
        };

        return await this.usersQueryRepository.findUsers(query);
    }

    // @Get(":id")
    // getUser(@Param('id') id: string) {
    //     return [{id: 1}, {id: 2}].find(a => a.id === +id)
    // }

    @Post()
    async createUser(
        @Body() userBody: UserInputDto,
        @Res({passthrough: true}) res: Response
    ) {
        const createdUser = await this.usersService.createUser(userBody)
        createdUser ? res.status(HttpStatus.CREATED).send(createdUser) : res.status(HttpStatus.BAD_REQUEST)
    }

    @Delete(':userId')
    async deleteUser(
        @Param('userId', IsUserExistPipe) userId: string,
        @Res({passthrough: true}) res: Response,
    ) {
        const isDeleteUser = await this.usersService.deleteUser(userId)
        isDeleteUser ? res.status(HttpStatus.NO_CONTENT) : res.status(HttpStatus.NOT_FOUND)
    }


    // @Delete()
    // deleteUser(@Param('id') id: string) {
    //     return
    // }
    // @Put()
    // updateUser(@Param('id') id: string, @Body() model: InputUserModelType) {
    //     return {
    //         id: id,
    //         model: model
    //     }
    // }
}
