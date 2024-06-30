import { IsEmail, IsString, Matches } from 'class-validator';
import { IsExistEmail } from '../../../../../common/decorators/validate/isExistEmail.decorator';

export class PasswordRecoveryInputDto {
    @IsString()
    @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    @IsEmail()
    email: string
}