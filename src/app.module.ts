import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './features/users/api/users.controller';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './features/users/domain/user.entity';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://admin:6XeshSKaryTj@cluster0.n2nwife.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            dbName: 'nest-test'
        }),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [AppController, UsersController],
    providers: [AppService, UsersService, UsersRepository],
})
export class AppModule {}
