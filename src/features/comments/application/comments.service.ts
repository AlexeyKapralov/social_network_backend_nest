import { Injectable } from '@nestjs/common';
import { CommentsViewDto } from '../api/dto/output/commentsView.dto';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UserDocument } from '../../users/domain/user.entity';
import { LikeStatus } from '../../likes/api/dto/output/likesViewDto';

@Injectable()
export class CommentsService {
    constructor(
       private readonly commentsRepository: CommentsRepository,
       private readonly usersRepository: UsersRepository,
    ) {}

    async getComment(commentId: string): Promise<CommentsViewDto> | null {
        const foundComment = await this.commentsRepository.getComment(commentId)
        if (!foundComment) {
            return null
        }
        const foundUser: UserDocument = await this.usersRepository.findUserById(foundComment.userId)
        const mappedComment: CommentsViewDto = {
            id: foundComment.id,
            content: foundComment.content,
            createdAt: foundComment.createdAt,
            commentatorInfo: {
                userId: foundComment.userId,
                userLogin: foundUser.login
            },
            likesInfo: {
                likesCount: foundComment.likesCount,
                dislikesCount: foundComment.dislikesCount,
                myStatus: LikeStatus.None //todo переписать когда будет авторизация
            }
        }
        return mappedComment

    }
}