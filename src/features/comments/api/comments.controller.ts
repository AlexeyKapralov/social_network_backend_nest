import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { Response } from 'express';

@Controller('comments')
export class CommentsController {

    constructor(
       private readonly commentService: CommentsService
    ) {}


    @Get(':commentId')
    async getComment(
        @Param('commentId') commentId: string,
        @Res({passthrough: true}) res: Response
    ) {
        const comment = await this.commentService.getComment(commentId)
        comment ? res.status(HttpStatus.OK).send(comment) : res.status(HttpStatus.NOT_FOUND)
    }
}