import { Injectable } from '@nestjs/common';
import { Post, PostModelType } from '../domain/posts.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostInputModel } from '../api/dto/input/postInput.model';

@Injectable()
export class PostsRepository {

    constructor(
        @InjectModel(Post.name) private postModel: PostModelType,
    ) {}

    async createPost(post: Post) {
        return await this.postModel.create(post)
    }

    async updatePost(postId: string, postUpdateData: PostInputModel) {
        return this.postModel.updateOne(
            {_id: postId, isDeleted: false},
            {...postUpdateData}
        )
    }

    async deletePost(postId: string) {
        return this.postModel.updateOne({
                _id: postId, isDeleted: false
            },
            {
                isDeleted: true
            })
    }
}