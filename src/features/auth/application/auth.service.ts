import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginInputDto } from '../api/dto/input/loginInput.dto';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { CryptoService } from '../../../base/services/crypto.service';
import { LoginSuccessTokenViewDto } from '../api/dto/output/LoginSuccessTokenView.dto';
import { UserInputDto } from '../../users/api/dto/input/userInputDto';
import { EmailService } from '../../../base/services/email.service';
import { UsersService } from '../../users/application/users.service';
import { UserDocument } from '../../users/domain/user.entity';
import { RegistrationConfirmationCodeDto } from '../api/dto/input/registrationConfirmationCode.dto';
import { RegistrationEmailResendingDto } from '../api/dto/input/registrationEmailResending.dto';
import { PasswordRecoveryInputDto } from '../api/dto/input/passwordRecoveryInput.dto';
import { v4 as uuid} from 'uuid';
import { NewPasswordRecoveryInputDto } from '../api/dto/input/newPasswordRecoveryInput.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly usersService: UsersService,
        private readonly cryptoService: CryptoService,
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService
    ) {}

    //todo возвращать должен какой-то общий interlayer
    async authUser(authBody: LoginInputDto): Promise<LoginSuccessTokenViewDto | null> {

        // const user = await Promise.any([
        //     this.userRepository.findUserByLogin(authBody.loginOrEmail),
        //     this.userRepository.findUserByEmail(authBody.loginOrEmail)
        // ])

        const user1 = await this.userRepository.findUserByLogin(authBody.loginOrEmail)
        const user2 = await this.userRepository.findUserByEmail(authBody.loginOrEmail)
        const user = user1 || user2

        if (!user) {
            throw new UnauthorizedException()
        }

        const isValidPassword: boolean = await this.cryptoService.comparePasswordsHash(authBody.password, user.password)

        if (isValidPassword) {
            const userId = user._id.toString()
            //todo переписать секрет и время жизни токена
            const accessToken = this.jwtService.sign( {userId})
            return {accessToken: accessToken}
        }
        return null
    }

    async registrationUser(userBody: UserInputDto) {
        const user = await this.usersService.createUser(userBody)
        const userDB: UserDocument = await this.userRepository.findUserById(user.id)
        const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
                     <a href='https://ab.com?code=${userDB.confirmationCode}'>complete registration</a>
				 </p>
			`
        try {
            this.emailService.sendConfirmationCode(userBody.email, 'Confirmation code', html)
        } catch (e) {
            console.error(`some problems with send confirm code ${e}`)
        }
    }
    async confirmationCode(confirmationCode: RegistrationConfirmationCodeDto) {
        return await this.userRepository.confirmUserRegistration(confirmationCode)
    }

    async resendCode(registrationEmailResendingBody: RegistrationEmailResendingDto) {
        const user = await this.userRepository.findUserByEmail(registrationEmailResendingBody.email)

        if (!user) throw new NotFoundException()

        const newConfirmationCode = uuid()
        await this.userRepository.updateConfirmationCode(user.email, newConfirmationCode)

        const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
                     <a href='https://ab.com?code=${newConfirmationCode}'>complete registration</a>
				 </p>
			`

        try {
            this.emailService.sendConfirmationCode(user.email, 'Confirmation code', html)
        } catch (e) {
            console.error(`some problems with send confirm code ${e}`)
        }
    }

    async passwordRecovery(passwordRecoveryInputBody: PasswordRecoveryInputDto) {
        const user = await this.userRepository.findUserByEmail(passwordRecoveryInputBody.email)
        if (user) {
            const newConfirmationCode = uuid()

            await this.userRepository.updateConfirmationCode(user.email, newConfirmationCode)

            const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
                     <a href='https://ab.com?code=${newConfirmationCode}'>complete registration</a>
				 </p>
			`

            try {
                this.emailService.sendConfirmationCode(user.email, 'Confirmation code', html)
            } catch (e) {
                console.error(`some problems with send confirm code ${e}`)
            }
        }
    }

    async setNewPassword(newPasswordBody: NewPasswordRecoveryInputDto) {
        const newPasswordHash = await this.cryptoService.createPasswordHash(newPasswordBody.newPassword)
        await this.userRepository.updatePassword(newPasswordBody.recoveryCode, newPasswordHash)
    }
}