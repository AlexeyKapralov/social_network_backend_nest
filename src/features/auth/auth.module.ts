import { Module } from '@nestjs/common';
import { AuthController } from './auth/api/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './devices/domain/device.entity';
import { DeviceRepository } from './devices/infrastructure/device.repository';
import { CreateDeviceUseCase } from './auth/application/usecases/create-device.usecase';
import { AuthService } from './auth/application/auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { CryptoService } from '../../base/services/crypto.service';
import { EmailService } from '../../base/services/email.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../settings/env/configuration';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { BasicStrategy } from './auth/strategies/basic.strategy';

@Module({
    imports: [
        CqrsModule,
        UsersModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService<ConfigurationType>) => {
                const apiSettings = configService.get('apiSettings', { infer: true });
                return {
                    secret: apiSettings.SECRET,
                    accessTokenLive: '10m', //todo можно ли в AuthModule обращаться к этой переменной? чтобы не доставать ApiSettings в authService
                    refreshTokenLive: '10m', //todo можно ли в AuthModule обращаться к этой переменной? чтобы не доставать ApiSettings в authService
                    signOptions: {
                        expiresIn: '1m'
                    }
                };
            },
            global: true,
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            {
                name: Device.name,
                schema: DeviceSchema
            }
        ])
    ],
    controllers: [AuthController],
    providers: [
        DeviceRepository,
        CreateDeviceUseCase,

        CryptoService,
        AuthService,
        EmailService,

        LocalStrategy,
        JwtStrategy,
        BasicStrategy,
    ],

    exports: [
        AuthService,
        DeviceRepository
    ]
})
export class AuthModule {

}