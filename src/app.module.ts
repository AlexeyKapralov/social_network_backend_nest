import { Module, Provider } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersController } from './features/users/api/users.controller';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './features/users/domain/user.entity';
import { AppController } from './app.controller';
import { UsersQueryRepository } from './features/users/infrastructure/users-query.repository';
import { BlogService } from './features/blogs/application/blog.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.entity';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogsQuery.repository';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { Post, PostSchema } from './features/posts/domain/posts.entity';
import { PostsQueryRepository } from './features/posts/infrastructure/posts-query.repository';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsController } from './features/comments/api/comments.controller';
import { Comment, CommentSchema } from './features/comments/domain/comment.entity';
import { IsUniqueLoginConstraint } from './common/decorators/validate/uniqueLogin.decorator';
import { IsUniqueEmailConstraint } from './common/decorators/validate/uniqueEmail.decorator';
import { CryptoService } from './base/services/crypto.service';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { EmailService } from './base/services/email.service';
import { IsExistConfirmationCodeConstraint } from './common/decorators/validate/isExistConfirmedCode.decorator';
import {
    IsExistEmailAndNotConfirmedCodeConstraint,
} from './common/decorators/validate/isExistEmailAndNotConfirmedCode.decorator';
import { IsExistEmailConstraint } from './common/decorators/validate/isExistEmail.decorator';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './features/auth/strategies/local.strategy';
import { JwtStrategy } from './features/auth/strategies/jwt.strategy';
import { BasicStrategy } from './features/auth/strategies/basic.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { ConfigurationType, validate } from './settings/env/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './features/users/application/usecases/create-user.usecase';
import { FindUsersQuery } from './features/users/infrastructure/queries/find-users.query';
import { UserCreatedEventHandler } from './features/users/application/events/handlers/user-created.event-handler';
import { DeviceRepository } from './features/devices/infrastructure/device.repository';
import { CreateDeviceUseCase } from './features/auth/application/usecases/create-device.usecase';
import { Device, DeviceSchema } from './features/devices/domain/device.entity';
import { CreateCommentUseCase } from './features/comments/application/usecases/create-comment.usecase';
import { CommentsQueryRepository } from './features/comments/infrastructure/commentsQuery.repository';
import { Like, LikeSchema } from './features/likes/domain/likes.entity';
import { JwtLocalService } from './base/services/jwt-local.service';
import { GetCommentsQuery } from './features/comments/infrastructure/queries/get-comments.query';
import { LikeService } from './features/likes/application/like.service';
import { LikeRepository } from './features/likes/repository/like.repository';
import { LikeQueryRepository } from './features/likes/repository/like-query.repository';
import { LikeCommentUseCase } from './features/comments/application/usecases/like-comment.usecase';
import { IsExistBlogConstraint } from './common/decorators/validate/isExistBlog.decorator';

const AuthProviders: Provider[] = [
    AuthService
];

const CommentsProviders: Provider[] = [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    CreateCommentUseCase,
    LikeCommentUseCase,
    GetCommentsQuery
];

const UsersProviders: Provider[] = [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    CreateUserUseCase,
    FindUsersQuery,
    UserCreatedEventHandler,
];

const BlogsProviders: Provider[] = [
    BlogService,
    BlogsRepository,
    BlogsQueryRepository,
];

const PostsProviders: Provider[] = [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
];
const DevicesProviders: Provider[] = [
    DeviceRepository,
    CreateDeviceUseCase,
];

const LikesProviders: Provider[] = [
    LikeService,
    LikeRepository,
    LikeQueryRepository
]

const decorators: Provider[] = [
    IsUniqueLoginConstraint,
    IsUniqueEmailConstraint,
    IsExistConfirmationCodeConstraint,
    IsExistEmailAndNotConfirmedCodeConstraint,
    IsExistEmailConstraint,
    IsExistBlogConstraint
];

const services: Provider[] = [
    CryptoService,
    EmailService,
    JwtLocalService
];

const strategies: Provider[] = [
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
];

@Module({
    imports: [
        CqrsModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validate: validate,
            ignoreEnvFile:
                false, //для development
            // process.env.ENV !== Environments.DEVELOPMENT && process.env.ENV !== Environments.TEST, //для production и staging
            envFilePath: ['.env.local', /*'.env'*/],
        }),
        PassportModule,
        JwtModule.registerAsync({
            // secret: 'secret',
            // signOptions: { expiresIn: '10m' },
            useFactory: (configService: ConfigService<ConfigurationType>) => {
                const apiSettings = configService.get('apiSettings', { infer: true });
                return {
                    secret: apiSettings.SECRET,
                    accessTokenExpirationLive: apiSettings.ACCESS_TOKEN_EXPIRATION_LIVE,
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
                useFactory: (configService: ConfigService<ConfigurationType>) => {
                    const environmentSettings = configService.get('environmentSettings', {
                        infer: true,
                    });
                    const databaseSettings = configService.get('databaseSettings', {
                        infer: true,
                    });
                    const uri = environmentSettings.isTesting
                        ? databaseSettings.MONGO_CONNECTION_URI_FOR_TESTS
                        : databaseSettings.MONGO_CONNECTION_URI;
                    console.log(uri);

                    return {
                        uri: uri,
                    };
                },
                inject: [ConfigService],
            },
            // appSettings.env.isTesting()
            // ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
            // : appSettings.api.MONGO_CONNECTION_URI,
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
                schema: CommentSchema,
            },
            {
                name: Device.name,
                schema: DeviceSchema
            },
            {
                name: Like.name,
                schema: LikeSchema
            }
        ]),

    ],
    controllers: [
        AppController,
        UsersController,
        BlogsController,
        PostsController,
        CommentsController,
        AuthController,
    ],
    providers: [
        AppService,
        ...LikesProviders,
        ...UsersProviders,
        ...BlogsProviders,
        ...PostsProviders,
        ...CommentsProviders,
        ...AuthProviders,
        ...DevicesProviders,
        ...decorators,
        ...services,
        ...strategies,
    ],
})
export class AppModule {
}
