import { IsString, IsStrongPassword, Length, Matches } from 'class-validator';
import { IsUniqueLogin } from '../../../../../common/decorators/validate/uniqueLogin.decorator';

export class LoginInputDto {
    @IsString()
    loginOrEmail: string


    @IsString()
    password: string
}