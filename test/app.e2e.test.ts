import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { agent as request } from 'supertest';
import { AppModule } from '../src/app.module';
import { applyAppSettings } from '../src/settings/apply-app-settings';
import { exhaustiveTypeException } from 'tsconfig-paths/lib/try-path';
import * as stream from 'node:stream';
import { aDescribe } from './utils/aDescribe';
import { skipSettings } from './utils/skip-settings';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import objectContaining = jasmine.objectContaining;
import { UserManagerTest } from './utils/userManager.test';

aDescribe(skipSettings.for('appTests'))('AppController (e2e)', () => {
    let app: INestApplication;
    let userManagerTest: UserManagerTest

    beforeAll(async () => {

        // можно создать глобальный state
        // expect.setState([
        //     // adminTokens: loginResult
        // ]);

        //получение глобальных переменных
        expect.getState();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            // .overrideProvider(UsersService) // для мока (передаем класс который хотим переопределить)
            // .useClass(UserSeviceMock) // моковый класс
            // useFactory используется если нужно передававть какие-то данные внутрь, если данные передававть не надо, то используется UseClass
            // .useFactory({
            //         factory: (usersRepo: UsersRepository) => {
            //             return new UserServiceMock(usersRepo, {
            //                 countL 50
            //             } )
            //         },
            //          inject: [UsersQueryRepository, UsersRepository] //последовательность важна
            //     })
            .compile();

        app = moduleFixture.createNestApplication();

        applyAppSettings(app);

        await app.init();

        const databaseConnection = app.get<Connection>(getConnectionToken());
        await databaseConnection.dropDatabase();

        //подключение менеджера
        userManagerTest = new UserManagerTest(app)
    });

    afterAll(async () => {
            await app.close();
        },
    );


    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });

    it('get empty array', async () => {

        return await request(app.getHttpServer())
            .get('/users')
            .expect(HttpStatus.OK)
            .expect({
                'pagesCount': 0,
                'page': 1,
                'pageSize': 10,
                'totalCount': 0,
                'items': [],
            });
    });

    it('should create user', async () => {
        const userBody = {
            login: 'qS-9oRnN-',
            password: 'string',
            email: 'example@example.com',
        }

        expect.setState({
            userBody: userBody,
        })

        const user = await userManagerTest.createUser(userBody)

        expect(user).toEqual({
            id: expect.any(String),
            login: userBody.login,
            email: userBody.email,
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
        });
    });

    it('should get user with pagination', async () => {

        const { userBody } = expect.getState();

        const user = await request(app.getHttpServer())
            .get('/users')
            .expect(HttpStatus.OK);

        expect(user.body).toEqual({
                'pagesCount': 1,
                'page': 1,
                'pageSize': 10,
                'totalCount': 1,
                'items': [{
                    id: expect.any(String),
                    login: userBody.login,
                    email: userBody.email,
                    createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                }],
            },
        );
    });

});