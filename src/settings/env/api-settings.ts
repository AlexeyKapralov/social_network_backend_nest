import { IsNumber } from 'class-validator';
import { EnvironmentVariable } from './env-settings';

export class ApiSettings {
    constructor(private environmentVariables: EnvironmentVariable) {
    }
    @IsNumber()
    PORT: number = Number(this.environmentVariables.PORT)
}