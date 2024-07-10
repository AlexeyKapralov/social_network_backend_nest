import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { BlogInputDto } from './dto/input/blog-input.dto';
import { BlogService } from '../application/blog.service';
import { QueryDtoBase, QueryDtoWithName } from '../../../common/dto/query.dto';
import { BlogsQueryRepository } from '../infrastructure/blogsQuery.repository';
import { BlogDocument } from '../domain/blogs.entity';
import { Response } from 'express';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query.repository';
import { BlogPostInputDto } from './dto/input/blog-post-input.dto';
import { PostDocument } from '../../posts/domain/posts.entity';
import { PostsViewDto } from '../../posts/api/dto/output/extended-likes-info-view.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogService: BlogService,
        private readonly blogQueryRepository: BlogsQueryRepository,
        private readonly postQueryRepository: PostsQueryRepository,
    ) {
    }

    @UseGuards(AuthGuard('basic'))
    @Post()
    async createBlog(
        @Body() blogBody: BlogInputDto,
    ) {
        const createdBlog: BlogDocument = await this.blogService.createBlog(blogBody);
        return await this.blogQueryRepository.findBlog(createdBlog._id.toString());
    }

    @UseGuards(AuthGuard('basic'))
    @Post(':blogId/posts')
    async createPostForBlog(
        @Param('blogId') blogId: string,
        @Body() blogPostBody: BlogPostInputDto,
        @Res({passthrough: true}) res: Response
    ) {
        const createdPostForBlog: PostsViewDto | null = await this.blogService.createPostForBlog(blogId, blogPostBody)
        createdPostForBlog ? res.status(HttpStatus.CREATED).send(createdPostForBlog) : res.status(HttpStatus.NOT_FOUND)
    }

    @Get()
    async getBlogs(
        @Query() query: QueryDtoWithName,
    ) {
        return await this.blogQueryRepository.findBlogs(query);
    }

    @Get(':blogId')
    async getBlog(
        @Param('blogId') blogId: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const foundedBlog = await this.blogQueryRepository.findBlog(blogId);

        foundedBlog ? res.status(HttpStatus.OK).send(foundedBlog) : res.status(HttpStatus.NOT_FOUND);
    }

    @UseGuards(AuthGuard('basic'))
    @Put(':blogId')
    async updateBlog(
        @Param('blogId') blogId: string,
        @Body() updateData: BlogInputDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const isUpdated = await this.blogService.updateBlog(blogId, updateData)
        isUpdated ? res.status(HttpStatus.NO_CONTENT) : res.status(HttpStatus.NOT_FOUND)
    }

    @UseGuards(AuthGuard('basic'))
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
        @Query() query: QueryDtoBase,
        @Res({ passthrough: true }) res: Response
    ) {

        const foundBlog = await this.blogQueryRepository.findBlog(blogId)

        if (!foundBlog) {
            res.status(HttpStatus.NOT_FOUND)
            return
        }

        const posts = await this.postQueryRepository.findPostsForBlog(query, foundBlog.id)

        posts ? res.status(HttpStatus.OK).send(posts) : res.status(HttpStatus.NOT_FOUND)
    }

}