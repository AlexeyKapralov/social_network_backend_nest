import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../api/dto/output/likes-view.dto';

@Schema()
export class Like {
    @Prop()
    userId: string
    @Prop()
    parentId: string
    @Prop()
    createdAt: string
    @Prop()
    likeStatus: LikeStatus

    static createLike(
        userId: string,
        parentId: string,//может быть и для поста и для комментария
        likeStatus?: LikeStatus
    ) {
        const like = new this()

        like.userId = userId
        like.parentId = parentId
        like.createdAt = new Date().toISOString()
        like.likeStatus = likeStatus ?? LikeStatus.None
        return like
    }

}

export const LikeSchema = SchemaFactory.createForClass(Like)

LikeSchema.statics = {
    createLike: Like.createLike,
}

type LikeStaticType = {
    createLike(
        userId: string,
        postId: string,
        likeStatus?: LikeStatus
    ): LikeDocument
}

export type LikeDocument = HydratedDocument<Like>
export type LikeModelType = Model<LikeDocument> & LikeStaticType
