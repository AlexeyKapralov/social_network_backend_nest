import { LikeDetailsViewDto, LikeStatus } from '../../../../likes/api/dto/output/likesViewDto';

export type PostsViewDto = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfoViewDto
}

export type ExtendedLikesInfoViewDto = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: LikeDetailsViewDto[]
}