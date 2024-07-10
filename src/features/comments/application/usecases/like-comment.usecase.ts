import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InterlayerNotice, InterLayerStatuses } from '../../../../base/models/interlayer';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentDocument } from '../../domain/comment.entity';
import { LikeDocument } from '../../../likes/domain/likes.entity';
import { LikeRepository } from '../../../likes/repository/like.repository';
import { LikeStatus } from '../../../likes/api/dto/output/likes-view.dto';

export class LikeCommentCommand {
    constructor(
        public commentId: string,
        public userId: string,
        public likeStatus: LikeStatus
    ) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentUseCase implements ICommandHandler<
    LikeCommentCommand,
    InterlayerNotice
> {
    constructor(
        private readonly commentsRepository: CommentsRepository,
        private readonly likeRepository: LikeRepository,
    ) {}

    async execute(command: LikeCommentCommand): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice

        const comment: CommentDocument  = await this.commentsRepository.getComment(
            command.commentId
        )
        if (!comment) {
            notice.addError(`comment did not find`, 'comment', InterLayerStatuses.NOT_FOUND)
            return notice
        }

        //обновление лайка
        let like: LikeDocument = await this.likeRepository.findLikeByUserAndParent(
            command.userId,
            command.commentId
        )
        if (!like) {
            like = await this.likeRepository.createLike(
                command.userId,
                command.commentId,
                command.likeStatus
            )
        } else {
            const isChangeLikeStatus = await this.likeRepository.changeLikeStatus(
                command.userId,
                command.commentId,
                command.likeStatus
            )
            if (!isChangeLikeStatus) {
                throw new Error('There was no change in status in like. Some problem with likeRepository.changeLikeStatus')
            }
        }

        //обновление комментария
        const isChangeLikeStatusComment = await this.commentsRepository.changeLikesAndDislikesCount(command.commentId, like.likeStatus, command.likeStatus)
        if (!isChangeLikeStatusComment) {
            throw new Error('There was no change in status in comment. Some problem with commentsRepository.changeLikesAndDislikesCoun')
        }

        return notice
    }
}

// export type LikeCommentResultType = {
//     isLikeSucces: boolean
// }