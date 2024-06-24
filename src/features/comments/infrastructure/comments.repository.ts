import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
    constructor(
       @InjectModel(Comment.name) private readonly commentModel: CommentModelType,
    ) {}
    async getComment(commentId: string) {
        return this.commentModel.findOne(
            {_id: commentId, isDeleted: false},
            {
                _id: 0,
                id: {$toString: '$_id'},
                content: 1,
                userId: 1,
                createdAt: 1,
                likesCount: 1,
                dislikesCount: 1
            }
            ).lean()
    }
}