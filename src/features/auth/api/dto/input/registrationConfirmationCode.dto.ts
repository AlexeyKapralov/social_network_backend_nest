import { IsString, IsUUID } from 'class-validator';
import { IsExistConfirmationCode } from '../../../../../common/decorators/validate/isExistConfirmedCode.decorator';

export class RegistrationConfirmationCodeDto {
    @IsString()
    @IsUUID()
    @IsExistConfirmationCode()
    code: string
}