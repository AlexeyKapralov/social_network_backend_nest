import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigurationType } from '../../../settings/env/configuration';
import { ApiSettings } from '../../../settings/env/api-settings';
import { ConfigService } from '@nestjs/config';

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