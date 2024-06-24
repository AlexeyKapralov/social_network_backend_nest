import { Injectable } from '@nestjs/common';
import { Blog, BlogModelType } from '../domain/blogs.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BlogInputModel } from '../api/dto/input/blogInput.model';
import { PostsRepository } from '../../posts/repository/posts.repository';
import { PostsQueryRepository } from '../../posts/repository/postsQuery.repository';

@Injectable()
export class BlogsRepository {
    constructor(
        @InjectModel(Blog.name) private readonly blogModel: BlogModelType,
        private readonly postQueryRepository: PostsQueryRepository
    ) {
    }

    async createBlog(blog: Blog) {
        return await this.blogModel.create(blog);
    }

    async updateBlog(blogId: string, updateData: BlogInputModel) {
        return this.blogModel.updateOne(
            { _id: blogId, isDeleted: false },
            {
                ...updateData
            },
        )
    }

    async deleteBlog(blogId: string) {
        return this.blogModel.updateOne(
            {_id: blogId , isDeleted: false},
            { isDeleted: true }
        )
    }

    async findBlog(blogId: string) {
        return this.blogModel.findOne({
            _id: blogId, isDeleted: false
        })
    }


}