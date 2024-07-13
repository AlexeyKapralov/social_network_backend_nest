import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy} from 'passport-http'

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy){

    async validate(username: string, password: string) {
        if (
            //todo скрыть админские логин и пароль
            username === 'admin' && password === 'qwerty'
        ) {
            return true
        }
        throw new UnauthorizedException();
    }
}