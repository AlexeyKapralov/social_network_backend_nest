import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exception-filters/httpExceptionFilter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import cookieParser from 'cookie-parser';

export const applyAppSettings = (app: INestApplication) => {
    app.enableCors();

    // Для внедрения зависимостей в validator constraint
    // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
    // когда DI не имеет необходимого класса.
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        //todo stop at first не работает с асинхронными?
        stopAtFirstError: true, //не работает с асинхронными декораторами
        exceptionFactory: (errors) => {

            const errorsForResponse = [];

            errors.forEach((e) => {
                const constrainsKeys = Object.keys(e.constraints);
                constrainsKeys.forEach((ckey) => {
                    errorsForResponse.push({
                        message: e.constraints[ckey],
                        field: e.property }
                    );
                });
            });

            throw new BadRequestException(errorsForResponse);
        },
    }));
    app.useGlobalFilters(new HttpExceptionFilter())
};