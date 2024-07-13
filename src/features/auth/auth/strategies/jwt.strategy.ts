import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../../../settings/env/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService<ConfigurationType>,
    ) {
        const apiSettings = configService.get('apiSettings', {infer: true})
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: apiSettings.SECRET
        })
    }

    async validate(payload: any) {
        return {
            id: payload.userId
        }
    }
}