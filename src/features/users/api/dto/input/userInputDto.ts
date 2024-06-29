import { IsEmail, Length, Matches } from 'class-validator';

export class UserInputDto {
    @IsEmail()
    @Length(3, 10)
    @Matches('^[a-zA-Z0-9_-]*$')

    login: string
    password: string
    email: string
}