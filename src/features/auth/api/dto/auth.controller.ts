import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UsePipes, Headers, Param } from '@nestjs/common';
import { LoginInputDto } from './input/loginInput.dto';
import { AuthService } from '../../application/auth.service';
import { Response } from 'express';
import { UserInputDto } from '../../../users/api/dto/input/userInputDto';
import { RegistrationConfirmationCodeDto } from './input/registrationConfirmationCode.dto';
import { RegistrationEmailResendingDto } from './input/registrationEmailResending.dto';
import { PasswordRecoveryInputDto } from './input/passwordRecoveryInput.dto';
import { NewPasswordRecoveryInputDto } from './input/newPasswordRecoveryInput.dto';
import { NewPasswordPipe } from '../../../../common/pipes/newPassword.pipe';
import { AccessTokenParsePipe } from '../../../../common/pipes/accessTokenParse.pipe';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    async loginUser(
        @Body() authBody: LoginInputDto,
        @Res({passthrough: true}) res: Response
    ) {
        const accessToken = await this.authService.authUser(authBody)

        accessToken
            ? res.status(HttpStatus.OK).send(accessToken)
            : res.status(HttpStatus.BAD_REQUEST).send()
    }

    @Post('password-recovery')
    @HttpCode(HttpStatus.NO_CONTENT)
    async passwordRecovery(
        @Body() passwordRecoveryInputBody: PasswordRecoveryInputDto,
    ) {
        await this.authService.passwordRecovery(passwordRecoveryInputBody)
    }

    @Post('new-password')
    @UsePipes(NewPasswordPipe)
    @HttpCode(HttpStatus.NO_CONTENT)
    async newPassword(
        @Body() newPasswordBody: NewPasswordRecoveryInputDto,
    ) {
        await this.authService.setNewPassword(newPasswordBody)
    }

    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationUser(
        @Body() userBody: UserInputDto,
    ) {
        await this.authService.registrationUser(userBody)
    }

    @Post('registration-confirmation')
    async registrationConfirmation(
        @Body() confirmationCode: RegistrationConfirmationCodeDto,
        @Res({passthrough: true}) res: Response
    ) {
        const isConfirmed = await this.authService.confirmationCode(confirmationCode)
        isConfirmed ? res.status(HttpStatus.NO_CONTENT) : res.status(HttpStatus.NOT_FOUND)
    }

    @Post('registration-email-resending')
    @HttpCode(HttpStatus.OK)
    async resendConfirmationCode(
        @Body() registrationEmailResendingBody: RegistrationEmailResendingDto
    ) {
        await this.authService.resendCode(registrationEmailResendingBody)
    }

    @Get('me')
    async getCurrentUser(
        @Headers('authorization')  accessToken: string
    ) {
        return accessToken
    }
}