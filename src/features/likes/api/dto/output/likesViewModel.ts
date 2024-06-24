export enum LikeStatus {
    None= 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export type LikeDetailsViewModel = {
    description: string,
    addedAt: string,
    userId: string,
    login: string
}