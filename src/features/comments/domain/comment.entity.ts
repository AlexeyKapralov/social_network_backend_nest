import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

//todo все схемы сделать со статическим методом create
@Schema()
export class Comment {
    @Prop()
    content: string
    @Prop()
    userId: string
    @Prop()
    createdAt: string
    @Prop()
    likesCount: number
    @Prop()
    dislikesCount: number
    @Prop()
    isDeleted: boolean

}

export const CommentSchema = SchemaFactory.createForClass(Comment)

export type CommentDocument = HydratedDocument<Comment>
export type CommentModelType = Model<CommentDocument>
