import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { IsUniqueLogin } from '../../../../../common/decorators/validate/uniqueLogin.decorator';
import { IsUniqueEmail } from '../../../../../common/decorators/validate/uniqueEmail.decorator';

export class UserInputDto {
    @Length(3, 10)
    @IsString()
    @Matches('^[a-zA-Z0-9_-]*$')
    @IsUniqueLogin()
    login: string

    @Length(6, 20)
    @IsString()
    password: string

    @IsEmail()
    @IsString()
    @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    @IsUniqueEmail()
    email: string
}