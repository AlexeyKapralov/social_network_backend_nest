import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../base/services/jwt.service';
import { UsersRepository } from '../../features/users/infrastructure/users.repository';
import { UserDocument } from '../../features/users/domain/user.entity';

@Injectable()
export class AccessTokenParsePipe implements PipeTransform {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersRepository: UsersRepository,
    ) {}

    async transform(value: string, metadata: ArgumentMetadata) {

        if (!value) throw new UnauthorizedException();

        const typeAuth = value.split(' ')[0];

        switch (typeAuth) {
            case 'Bearer' :
                const token = value.split(' ')[1];
                const userId = this.jwtService.getUserIdByAccessToken(token);
                const result: UserDocument = await this.usersRepository.findUserById(userId.toString());
                return result._id.toString();

            case 'Basic':
                const buff = Buffer.from(value.slice(5), 'base64');
                const decodedAuth = buff.toString('utf-8');
                if (decodedAuth !== 'admin:qwerty' || value.slice(0, 5) !== 'Basic') {
                    throw new UnauthorizedException()
                }
                return 'test1'
            default :
                return 'test2'
        }
    }
}