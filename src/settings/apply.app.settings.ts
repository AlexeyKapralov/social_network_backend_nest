import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exception-filters/httpExceptionFilter';

export const applyAppSettings = (app: INestApplication) => {
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
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