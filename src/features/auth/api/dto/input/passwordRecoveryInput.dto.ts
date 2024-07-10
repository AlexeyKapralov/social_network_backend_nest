import { IsEmail, IsString, Matches } from 'class-validator';
import { IsExistEmail } from '../../../../../common/decorators/validate/isExistEmail.decorator';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';

export class PasswordRecoveryInputDto {
    @Trim()
    @IsString()
    @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    @IsEmail()
    email: string
}