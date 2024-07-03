import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { IsUniqueLogin } from '../../../../../common/decorators/validate/uniqueLogin.decorator';
import { IsUniqueEmail } from '../../../../../common/decorators/validate/uniqueEmail.decorator';

export class UserInputDto {
    //todo асинхронные должны быть сверху, так как работать будет снизу вверх
    @IsUniqueLogin()
    @Length(3, 10)
    @IsString()
    @Matches('^[a-zA-Z0-9_-]*$')
    login: string

    @Length(6, 20)
    @IsString()
    password: string

    //todo асинхронные должны быть сверху, так как работать будет снизу вверх
    @IsUniqueEmail()
    @IsEmail()
    @IsString()
    @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    email: string
}