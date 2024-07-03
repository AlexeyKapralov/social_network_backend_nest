import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            //todo переписать чтобы здесь секрет не использовался в открытую
            secretOrKey: 'secret'
        }
        )
    }

    async validate(payload: any) {
        return {
            id: payload.userId
        }
    }
}