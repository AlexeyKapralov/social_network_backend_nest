import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { LoginSuccessTokenViewDto } from '../../features/auth/api/dto/output/LoginSuccessTokenView.dto';

@Injectable()
export class JwtService {
    //todo secret key скрыть в env и expiresIn тоже сделать в константе
    createAccessToken(userId: string): LoginSuccessTokenViewDto {
        return {
            accessToken: jwt.sign({ userId }, 'secretKey', {
                expiresIn: 300 /* кол-во секунд */,
            }),
        };
    }
    //todo secret key скрыть в env и expiresIn тоже сделать в константе
    getUserIdByAccessToken(accessToken: string): string {
        try {
            const result: any = jwt.verify(accessToken, 'secretKey')
            return result.userId
        } catch (e) {
            throw new UnauthorizedException()
        }
    }
}