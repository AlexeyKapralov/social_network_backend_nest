import { Injectable } from '@nestjs/common'
import jwt from 'jsonwebtoken'
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
}