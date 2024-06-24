import { ExtendedLikesInfoViewModel } from '../../../../posts/api/dto/output/extendedLikesInfoView.model';

export type CommentsViewModel = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
    likesInfo: LikesInfoViewModel
}

type CommentatorInfo = {
    userId: string,
    userLogin: string
}
type LikesInfoViewModel = Omit<ExtendedLikesInfoViewModel, 'newestLikes'>