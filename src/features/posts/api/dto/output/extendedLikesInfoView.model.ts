import { LikeDetailsViewModel, LikeStatus } from '../../../../likes/api/dto/output/likesViewModel';

export type PostsViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfoViewModel
}

export type ExtendedLikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: LikeDetailsViewModel[]
}