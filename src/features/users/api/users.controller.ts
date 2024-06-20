import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserInputModel } from './models/input/userInput.model';

@Controller('users')
export class UsersController {
    constructor(protected userService: UsersService) {}

    @Get()
    getUsers(@Query('term') term: string) {
        return this.userService.findUser(term);
    }

    // @Get(":id")
    // getUser(@Param('id') id: string) {
    //     return [{id: 1}, {id: 2}].find(a => a.id === +id)
    // }
    @Post()
    createUser(@Body() userBody: UserInputModel) {
        this.userService.createUser(userBody)
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
