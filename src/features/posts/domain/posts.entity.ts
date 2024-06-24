import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExtendedLikesInfoViewModel } from '../api/dto/output/extendedLikesInfoView.model';
import { HydratedDocument, Model } from 'mongoose';
import { BlogViewModel } from '../../blogs/api/dto/output/blogView.model';
import { LikeStatus } from '../../likes/api/dto/output/likesViewModel';

@Schema()
export class Post {

    @Prop()
    title: string

    @Prop()
    shortDescription: string

    @Prop()
    content: string

    @Prop()
    blogId: string

    @Prop()
    blogName: string

    @Prop()
    createdAt: string

    @Prop()
    likesCount: number

    @Prop()
    dislikesCount: number

    @Prop()
    myStatus: LikeStatus

    @Prop()
    isDeleted: boolean

    // static async create(data: PostDbModel) {
    //     const p =
    //     p.title = data.title
    //     p.shortDescription = data.shortDescription
    //     p.content = data.content
    //     p.blogId = data.blogId
    //     p.blogName = data.blogName
    //     p.createdAt = data.createdAt
    //     p.likesCount = data.likesCount
    //     p.dislikesCount = data.dislikesCount
    //     p.myStatus = data.myStatus
    //     return p
    // }

}

export const PostSchema = SchemaFactory.createForClass(Post)

// export type PostDbModel = {
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     blogName: string,
//     createdAt: string,
//     likesCount: number,
//     dislikesCount: number,
//     myStatus: LikeStatus
// }

// export type PostsStaticType = {
//     create: (data: PostDbModel) => Post
// }

export type PostDocument = HydratedDocument<Post>
export type PostModelType = Model<PostDocument> // & PostsStaticType

