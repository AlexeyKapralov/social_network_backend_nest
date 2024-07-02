import { IsString, IsUUID, Length } from 'class-validator';

export class NewPasswordRecoveryInputDto {
    @Length(6,20)
    @IsString()
    newPassword: string

    @IsString()
    @IsUUID()
    recoveryCode:	string
}