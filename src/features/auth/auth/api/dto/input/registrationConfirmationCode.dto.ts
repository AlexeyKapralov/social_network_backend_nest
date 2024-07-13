import { IsString, IsUUID } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim.decorator';
import { IsExistConfirmationCode } from '../../../../../../common/decorators/validate/isExistConfirmedCode.decorator';

export class RegistrationConfirmationCodeDto {
    //todo асинхронные должны быть сверху, так как работать будет снизу вверх
    //todo лучше проверку корректности бизнес данных (существует ли что-то в бд и т.д.) лучше здесь не делать
    @Trim()
    @IsExistConfirmationCode()
    @IsString()
    @IsUUID()
    code: string
}