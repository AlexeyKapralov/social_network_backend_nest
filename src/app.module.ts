import { Module, Provider } from '@nestjs/common';
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
import { IsUniqueLoginConstraint } from './common/decorators/validate/uniqueLogin.decorator';
import { IsUniqueEmailConstraint } from './common/decorators/validate/uniqueEmail.decorator';
import { CryptoService } from './base/services/crypto.service';
import { AuthController } from './features/auth/api/dto/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { EmailService } from './base/services/email.service';
import { IsExistConfirmationCodeConstraint } from './common/decorators/validate/isExistConfirmedCode.decorator';
import {
    IsExistEmailAndNotConfirmedCodeConstraint
} from './common/decorators/validate/isExistEmailAndNotConfirmedCode.decorator';
import { IsExistEmailConstraint } from './common/decorators/validate/isExistEmail.decorator';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './features/auth/strategies/local.strategy';
import { JwtStrategy } from './features/auth/strategies/jwt.strategy';
import { BasicStrategy } from './features/auth/strategies/basic.strategy';

const AuthProviders: Provider[] = [
    AuthService
]

const CommentsProviders: Provider[] = [
    CommentsService,
    CommentsRepository
]

const UsersProviders: Provider[] = [
    UsersService,
    UsersRepository,
    UsersQueryRepository
]

const BlogsProviders: Provider[] = [
    BlogService,
    BlogsRepository,
    BlogsQueryRepository
]

const PostsProviders: Provider[] = [
    PostsService,
    PostsRepository,
    PostsQueryRepository
]

const decorators: Provider[] = [
    IsUniqueLoginConstraint,
    IsUniqueEmailConstraint,
    IsExistConfirmationCodeConstraint,
    IsExistEmailAndNotConfirmedCodeConstraint,
    IsExistEmailConstraint
]

const services: Provider[] = [
    CryptoService,
    EmailService
]

const strategies: Provider[] = [
    LocalStrategy,
    JwtStrategy,
    BasicStrategy
]

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            //todo переписать чтобы здесь секрет не использовался в открытую
            secret: 'secret',
            signOptions: { expiresIn: '10m' }
        }),
        MongooseModule.forRoot(
            appSettings.env.isTesting()
            ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
            : appSettings.api.MONGO_CONNECTION_URI,
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
    controllers: [
        AppController,
        UsersController,
        BlogsController,
        PostsController,
        CommentsController,
        AuthController
    ],
    providers: [
        AppService,
        ...UsersProviders,
        ...BlogsProviders,
        ...PostsProviders,
        ...CommentsProviders,
        ...AuthProviders,
        ...decorators,
        ...services,
        ...strategies
    ],
})
export class AppModule {}
