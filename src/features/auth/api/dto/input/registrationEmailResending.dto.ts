import { IsEmail, IsString, Matches } from 'class-validator';
import {
    IsExistEmailAndNotConfirmedCode
} from '../../../../../common/decorators/validate/isExistEmailAndNotConfirmedCode.decorator';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';

export class RegistrationEmailResendingDto {
    //todo асинхронные должны быть сверху, так как работать будет снизу вверх
    @Trim()
    @IsExistEmailAndNotConfirmedCode()
    @IsString()
    @IsEmail()
    @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    email: string;
}