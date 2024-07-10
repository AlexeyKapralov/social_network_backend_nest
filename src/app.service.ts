import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './features/users/domain/user.entity';
import { Post, PostModelType } from './features/posts/domain/posts.entity';
import { Blog, BlogModelType } from './features/blogs/domain/blogs.entity';
import { Device, DeviceModelType } from './features/devices/domain/device.entity';
import { Like, LikeModelType } from './features/likes/domain/likes.entity';
import { Comment, CommentModelType } from './features/comments/domain/comment.entity';

@Injectable()
export class AppService {
    constructor(
        @InjectModel(User.name) private userModel: UserModelType,
        @InjectModel(Post.name) private postModel: PostModelType,
        @InjectModel(Blog.name) private blogModel: BlogModelType,
        @InjectModel(Device.name) private deviceModel: DeviceModelType,
        @InjectModel(Like.name) private likeModel: LikeModelType,
        @InjectModel(Comment.name) private commentModel: CommentModelType

    ) {}
    getHello(): string {
        return 'Hello World!'
    }

    async deleteAll() {
        await this.userModel.deleteMany()
        await this.postModel.deleteMany()
        await this.blogModel.deleteMany()
        await this.deviceModel.deleteMany()
        await this.likeModel.deleteMany()
        await this.commentModel.deleteMany()
    }
}
