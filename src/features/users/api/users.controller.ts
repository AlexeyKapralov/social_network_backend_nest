import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from '../application/users.service';

@Controller('users')
export class UsersController {
    constructor(protected userService: UsersService) {
    }
    @Get('users')
    getUsers(@Query('term') term: string) {
        return this.userService.findUser(term)
    }
    // @Get(":id")
    // getUser(@Param('id') id: string) {
    //     return [{id: 1}, {id: 2}].find(a => a.id === +id)
    // }
    // @Post()
    // createUsers(@Body() body: InputUserModelType) {
    //     return {name: body.name, count: body.count}
    // }
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

type InputUserModelType = {
    name: string,
    count: number
}