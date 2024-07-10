import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, LikeModelType } from '../domain/likes.entity';
import { LikeStatus } from '../api/dto/output/likes-view.dto';

@Injectable()
export class LikeRepository {
    constructor(
        @InjectModel(Like.name) private readonly likeModel: LikeModelType
    ) {}
    async createLike(userId: string, parentId: string, likeStatus: LikeStatus = LikeStatus.None): Promise<LikeDocument> {

        const like: LikeDocument = this.likeModel.createLike(userId, parentId, likeStatus)

        //todo это неправильно, надо сделать отдельную конманду на сохранение
        await like.save()
        return like
    }

    async changeLikeStatus(userId: string, parentId: string, likeStatus: LikeStatus): Promise<boolean> {
        const like = await this.findLikeByUserAndParent(userId, parentId)

        if (!like) {
            return false
        }

        like.likeStatus = likeStatus
        //todo сделать метод для сохранение в mongoose model
        await like.save()
        return true
    }

    /*
    * найти комментарий по userId и по ParentId ( PostId или CommentId)
    * */
    async findLikeByUserAndParent(userId: string, parentId: string): Promise<LikeDocument> {
        return this.likeModel.findOne(
            {userId: userId, parentId: parentId}
        )
    }

}