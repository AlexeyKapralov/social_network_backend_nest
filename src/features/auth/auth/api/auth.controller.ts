import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Ip,
    Post, Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { LoginInputDto } from './dto/input/loginInput.dto';
import { AuthService } from '../application/auth.service';
import {  Response } from 'express';
import { RegistrationConfirmationCodeDto } from './dto/input/registrationConfirmationCode.dto';
import { RegistrationEmailResendingDto } from './dto/input/registrationEmailResending.dto';
import { PasswordRecoveryInputDto } from './dto/input/passwordRecoveryInput.dto';
import { NewPasswordRecoveryInputDto } from './dto/input/newPasswordRecoveryInput.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from './decorators/current-user.param.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreateDeviceCommand, CreateDeviceResultType } from '../application/usecases/create-device.usecase';
import { InterlayerNotice } from '../../../../base/models/interlayer';
import { NewPasswordPipe } from '../../../../common/pipes/new-password.pipe';
import { UserInputDto } from '../../../users/api/dto/input/user-input.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly commandBus: CommandBus,) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async authUser(
        @Body() authBody: LoginInputDto,
        @Ip() ip: string,
        @Headers('user-agent') deviceName: string,
        @CurrentUserId() userId: string,
        @Res({passthrough: true}) res: Response
    ) {

        const command = new CreateDeviceCommand(authBody.loginOrEmail, ip, deviceName)
        const createdDevice = await this.commandBus.execute<CreateDeviceCommand, InterlayerNotice<CreateDeviceResultType>
        >(command)

        if (!userId || createdDevice.hasError()) {
            throw new UnauthorizedException()
        }

        const tokens =  await this.authService.createTokens(userId, createdDevice.data.deviceId)

        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
        return {accessToken: tokens.accessToken}
    }

    @Post('password-recovery')
    @HttpCode(HttpStatus.NO_CONTENT)
    async passwordRecovery(
        @Body() passwordRecoveryInputBody: PasswordRecoveryInputDto,
    ) {
        await this.authService.passwordRecovery(passwordRecoveryInputBody);
    }

    @Post('new-password')
    @UsePipes(NewPasswordPipe)
    @HttpCode(HttpStatus.NO_CONTENT)
    async newPassword(@Body() newPasswordBody: NewPasswordRecoveryInputDto) {
        await this.authService.setNewPassword(newPasswordBody);
    }

    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationUser(@Body() userBody: UserInputDto) {
        await this.authService.registrationUser(userBody);
    }

    @Post('registration-confirmation')
    async registrationConfirmation(
        @Body() confirmationCode: RegistrationConfirmationCodeDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const isConfirmed =
            await this.authService.confirmationCode(confirmationCode);
        isConfirmed
            ? res.status(HttpStatus.NO_CONTENT)
            : res.status(HttpStatus.NOT_FOUND);
    }

    @Post('registration-email-resending')
    @HttpCode(HttpStatus.NO_CONTENT)
    async resendConfirmationCode(
        @Body() registrationEmailResendingBody: RegistrationEmailResendingDto,
    ) {
        await this.authService.resendCode(registrationEmailResendingBody);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getCurrentUser(
        // @Headers('authorization')  accessToken: string
        @CurrentUserId() currentUserId: string,
    ) {
        return currentUserId
    }
}