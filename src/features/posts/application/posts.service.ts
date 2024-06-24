import { Injectable } from '@nestjs/common';
import { PostDocument } from '../domain/posts.entity';
import { PostInputModel } from '../api/dto/input/postInput.model';
import { LikeStatus } from '../../likes/api/dto/output/likesViewModel';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogsQuery.repository';
import { PostsRepository } from '../repository/posts.repository';
import { PostsQueryRepository } from '../repository/postsQuery.repository';
import { PostsViewModel } from '../api/dto/output/extendedLikesInfoView.model';

@Injectable()
export class PostsService {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly blogsQueryRepository: BlogsQueryRepository,
        private readonly postQueryRepository: PostsQueryRepository
    ) {
    }

    async createPost(postInputData: PostInputModel): Promise<PostsViewModel> {
        const foundBlog = await this.blogsQueryRepository.findBlog(postInputData.blogId)
        const post = {
            title: postInputData.title,
            content: postInputData.content,
            createdAt: new Date().toISOString(),
            blogId: postInputData.blogId,
            blogName: foundBlog.name,
            shortDescription: postInputData.shortDescription,
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None,
            isDeleted: false
        }
        const createdPost = await this.postsRepository.createPost(post)
        return await this.postQueryRepository.findPost(createdPost._id.toString())

    }

    async updatePost(postId: string, updateData: PostInputModel) {
        const isUpdatedPost = await this.postsRepository.updatePost(postId, updateData)
        return isUpdatedPost.modifiedCount > 0
    }
    async deletePost(postId: string) {
        const isDeletedPost = await this.postsRepository.deletePost(postId)
        return isDeletedPost.modifiedCount > 0
    }
}