import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { BlogInputModel } from './dto/input/blogInput.model';
import { BlogService } from '../application/blog.service';
import { QueryDto } from '../../../common/dto/query.dto';
import { BlogsQueryRepository } from '../infrastructure/blogsQuery.repository';
import { BlogDocument } from '../domain/blogs.entity';
import { Response } from 'express';
import { PostsQueryRepository } from '../../posts/repository/postsQuery.repository';
import { BlogPostInputModel } from './dto/input/blogPostInputModel';
import { PostDocument } from '../../posts/domain/posts.entity';
import { PostsViewModel } from '../../posts/api/dto/output/extendedLikesInfoView.model';

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogService: BlogService,
        private readonly blogQueryRepository: BlogsQueryRepository,
        private readonly postQueryRepository: PostsQueryRepository,
    ) {
    }

    @Post()
    async createBlog(
        @Body() blogBody: BlogInputModel,
    ) {
        const createdBlog: BlogDocument = await this.blogService.createBlog(blogBody);
        return await this.blogQueryRepository.findBlog(createdBlog._id.toString());
    }

    @Post(':blogId/posts')
    async createPostForBlog(
        @Param('blogId') blogId: string,
        @Body() blogPostBody: BlogPostInputModel,
        @Res({passthrough: true}) res: Response
    ) {
        const createdPostForBlog: PostsViewModel | null = await this.blogService.createPostForBlog(blogId, blogPostBody)
        createdPostForBlog ? res.status(HttpStatus.CREATED).send(createdPostForBlog) : res.status(HttpStatus.NOT_FOUND)
    }

    @Get()
    async getBlogs(
        @Query() query: any,
    ) {
        let sortDirection;
        if (query.sortDirection === 'asc') {
            sortDirection = 1;
        }
        if (query.sortDirection === 'desc') {
            sortDirection = -1;
        }

        const mappedQuery: Omit<QueryDto, 'searchLoginTerm' | 'searchEmailTerm'> = {
            sortBy: query.sortBy || 'createdAt',
            sortDirection: sortDirection || -1,
            pageNumber: Number(query.pageNumber) || 1,
            pageSize: Number(query.pageSize) || 10,
            searchNameTerm: query.searchNameTerm || null,
        };

        return await this.blogQueryRepository.findBlogs(mappedQuery);
    }

    @Get(':blogId')
    async getBlog(
        @Param('blogId') blogId: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const foundedBlog = await this.blogQueryRepository.findBlog(blogId);

        foundedBlog ? res.status(HttpStatus.OK).send(foundedBlog) : res.status(HttpStatus.NOT_FOUND);
    }

    @Put(':blogId')
    async updateBlog(
        @Param('blogId') blogId: string,
        @Body() updateData: BlogInputModel,
        @Res({ passthrough: true }) res: Response,
    ) {
        const isUpdated = await this.blogService.updateBlog(blogId, updateData)
        isUpdated ? res.status(HttpStatus.NO_CONTENT) : res.status(HttpStatus.NOT_FOUND)
    }

    @Delete(':blogId')
    async deleteBlog(
        @Param('blogId') blogId: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const isDeleted = await this.blogService.deleteBlog(blogId)
        isDeleted ? res.status(HttpStatus.NO_CONTENT) : res.status(HttpStatus.NOT_FOUND)
    }

    @Get(':blogId/posts')
    async getPostsForBlog(
        @Param('blogId') blogId: string,
        @Query() query: any,
        @Res({ passthrough: true }) res: Response
    ) {
        let sortDirection: number
        if (query.sortDirection === 'asc') {
            sortDirection = 1
        }
        if (query.sortDirection === 'desc') {
            sortDirection = -1
        }

        const mappedQuery: Omit<QueryDto, 'searchLoginTerm' | 'searchEmailTerm' | 'searchNameTerm'> = {
            sortBy: query.sortBy || 'createdAt',
            sortDirection: sortDirection || -1,
            pageNumber: Number(query.pageNumber) || 1,
            pageSize: Number(query.pageSize) || 10
        };

        const foundBlog = await this.blogQueryRepository.findBlog(blogId)

        if (!foundBlog) {
            res.status(HttpStatus.NOT_FOUND)
            return
        }

        const posts = await this.postQueryRepository.findPostsForBlog(mappedQuery, foundBlog.id)

        posts ? res.status(HttpStatus.OK).send(posts) : res.status(HttpStatus.NOT_FOUND)
    }

}