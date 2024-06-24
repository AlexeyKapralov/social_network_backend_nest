import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { PostInputModel } from './dto/input/postInput.model';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repository/postsQuery.repository';
import { Request, Response } from 'express';
import { QueryDto } from '../../../common/dto/query.dto';

@Controller('posts')
export class PostsController {
    constructor(
       private readonly postService: PostsService,
       private readonly postQueryRepository: PostsQueryRepository,
    ) {}


    @Post()
    async createPost(
        @Body() postInputData: PostInputModel
    ) {
        return await this.postService.createPost(postInputData)
    }
    @Get(':postId')
    async findPost(
        @Param('postId') postId: string,
        @Res({passthrough: true}) res: Response
    ) {
        const foundPost = await this.postQueryRepository.findPost(postId)
        foundPost ? res.status(HttpStatus.OK).send(foundPost) : res.status(HttpStatus.NOT_FOUND)
    }

    @Get()
    async findPosts(
        @Req() req: Request<{}, {}, {}, QueryDto>
    ) {
        let sortDirection
        if (req.query.sortDirection === 'asc') {
            sortDirection = 1
        }
        if (req.query.sortDirection === 'desc') {
            sortDirection = -1
        }

        const query: Omit<QueryDto, 'searchNameTerm' | 'searchEmailTerm' | 'searchLoginTerm'> = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: sortDirection || -1
        };

        return await this.postQueryRepository.findPosts(query);
    }

    @Put(':postId')
    async updatePost(
        @Param('postId') postId: string,
        @Body() postUpdateData: PostInputModel,
        @Res({passthrough: true}) res: Response
    ) {
        const isUpdatedPost = await this.postService.updatePost(postId, postUpdateData)
        isUpdatedPost ? res.status(HttpStatus.NO_CONTENT) : res.status(HttpStatus.NOT_FOUND)
    }

    @Delete(':postId')
    async deletePost(
        @Param('postId') postId: string,
        @Res({passthrough: true}) res: Response
    ) {
        const isDeletedPost = await this.postService.deletePost(postId)
        isDeletedPost ? res.status(HttpStatus.NO_CONTENT) : res.status(HttpStatus.NOT_FOUND)
    }
}