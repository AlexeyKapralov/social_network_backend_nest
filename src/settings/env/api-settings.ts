import { IsNumber, IsString, Matches } from 'class-validator';
import { EnvironmentVariable } from './env-settings';

export class ApiSettings {
    constructor(private environmentVariables: EnvironmentVariable) {
    }
    @IsNumber()
    PORT: number = Number(this.environmentVariables.PORT)
    @IsString()
    SECRET: string = this.environmentVariables.SECRET
    @Matches('\\d+(?: days|m)')
    ACCESS_TOKEN_EXPIRATION_LIVE: string = this.environmentVariables.ACCESS_TOKEN_EXPIRATION_LIVE
    @Matches('\\d+(?: days|m)')
    REFRESH_TOKEN_EXPIRATION_LIVE: string = this.environmentVariables.REFRESH_TOKEN_EXPIRATION_LIVE
}