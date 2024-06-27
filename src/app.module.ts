import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersController } from './features/users/api/users.controller';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './features/users/domain/user.entity';
import { AppController } from './app.controller';
import { UsersQueryRepository } from './features/users/infrastructure/usersQuery.repository';
import { BlogService } from './features/blogs/application/blog.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.entity';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogsQuery.repository';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepository } from './features/posts/repository/posts.repository';
import { Post, PostSchema } from './features/posts/domain/posts.entity';
import { PostsQueryRepository } from './features/posts/repository/postsQuery.repository';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsController } from './features/comments/api/comments.controller';
import { Comment, CommentSchema } from './features/comments/domain/comment.entity';
import { appSettings } from './settings/app.settings';

const CommentsProviders = [
    CommentsService,
    CommentsRepository
]

const UsersProviders = [
    UsersService,
    UsersRepository,
    UsersQueryRepository
]

const BlogsProviders = [
    BlogService,
    BlogsRepository,
    BlogsQueryRepository
]

const PostsProviders = [
    PostsService,
    PostsRepository,
    PostsQueryRepository
]

@Module({
    imports: [
        MongooseModule.forRoot(
            appSettings.env.isTesting()
            ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
            : appSettings.api.MONGO_CONNECTION_URI,
            // { dbName: 'nest-test' }
            // 'mongodb+srv://admin:6XeshSKaryTj@cluster0.n2nwife.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            //     dbName: 'nest-test'
            // }
        ),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
            {
                name: Blog.name,
                schema: BlogSchema,
            },
            {
                name: Post.name,
                schema: PostSchema,
            },
            {
                name: Comment.name,
                schema: CommentSchema
            }
        ]),

    ],
    controllers: [AppController, UsersController, BlogsController, PostsController, CommentsController],
    providers: [AppService, ...UsersProviders, ...BlogsProviders, ...PostsProviders, ...CommentsProviders],
})
export class AppModule {}
