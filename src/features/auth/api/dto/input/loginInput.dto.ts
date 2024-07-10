import { IsString, IsStrongPassword, Length, Matches } from 'class-validator';
import { IsUniqueLogin } from '../../../../../common/decorators/validate/uniqueLogin.decorator';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';

export class LoginInputDto {
    @IsString()
    @Trim()
    loginOrEmail: string

    @IsString()
    @Trim()
    password: string
}