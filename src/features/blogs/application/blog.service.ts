import { Injectable } from '@nestjs/common';
import { BlogInputModel } from '../api/dto/input/blogInput.model';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Blog } from '../domain/blogs.entity';
import { BlogsQueryRepository } from '../infrastructure/blogsQuery.repository';
import { QueryDto } from '../../../common/dto/query.dto';
import { PostInputModel } from '../../posts/api/dto/input/postInput.model';
import { PostsViewModel } from '../../posts/api/dto/output/extendedLikesInfoView.model';
import { LikeStatus } from '../../likes/api/dto/output/likesViewModel';
import { BlogPostInputModel } from '../api/dto/input/blogPostInputModel';
import { PostsRepository } from '../../posts/repository/posts.repository';
import { PostsQueryRepository } from '../../posts/repository/postsQuery.repository';

@Injectable()
export class BlogService {
    constructor(
        private readonly blogRepository: BlogsRepository,
        private readonly postsRepository: PostsRepository,
        private readonly postsQueryRepository: PostsQueryRepository,
    ) {}

    async createBlog(blogBody: BlogInputModel) {
        //todo правильно ли здесь создавать все поля для новой записи
        const blog: Blog = {
            name: blogBody.name,
            description: blogBody.description,
            createdAt: new Date().toISOString(),
            isMembership: false,
            isDeleted: false,
            websiteUrl: blogBody.websiteUrl
        }
        return await this.blogRepository.createBlog(blog)
    }

    async createPostForBlog(blogId: string, blogPostBody: BlogPostInputModel): Promise<PostsViewModel> | null {

        const foundBlog = await this.blogRepository.findBlog(blogId)
        if (!foundBlog) {
            return null
        }
        const post = {
            title: blogPostBody.title,
            content: blogPostBody.content,
            createdAt: new Date().toISOString(),
            blogId: blogId,
            blogName: foundBlog.name,
            shortDescription: blogPostBody.shortDescription,
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None,
            isDeleted: false
        }
        const createdPost = await this.postsRepository.createPost(post)
        return await this.postsQueryRepository.findPost(createdPost._id.toString())
    }

    async updateBlog(blogId: string, updateData: BlogInputModel) {
        const isUpdatedBlog = await this.blogRepository.updateBlog(blogId, updateData)
        return isUpdatedBlog.modifiedCount > 0
    }
    async deleteBlog(blogId: string) {
        const isDeleteBlog = await this.blogRepository.deleteBlog(blogId)
        return isDeleteBlog.modifiedCount
    }


}