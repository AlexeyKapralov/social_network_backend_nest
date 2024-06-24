import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './features/users/domain/user.entity';
import { Post, PostModelType } from './features/posts/domain/posts.entity';
import { Blog, BlogModelType } from './features/blogs/domain/blogs.entity';

@Injectable()
export class AppService {
    constructor(
        @InjectModel(User.name) private userModel: UserModelType,
        @InjectModel(Post.name) private postModel: PostModelType,
        @InjectModel(Blog.name) private blogModel: BlogModelType
    ) {}
    getHello(): string {
        return 'Hello World!'
    }

    async deleteAll() {
        await this.userModel.deleteMany()
        await this.postModel.deleteMany()
        await this.blogModel.deleteMany()
    }
}
