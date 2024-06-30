import { IsEmail, IsString, Matches } from 'class-validator';
import {
    IsExistEmailAndNotConfirmedCode
} from '../../../../../common/decorators/validate/isExistEmailAndNotConfirmedCode.decorator';

export class RegistrationEmailResendingDto {
    @IsString()
    @IsEmail()
    @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    @IsExistEmailAndNotConfirmedCode()
    email: string;
}