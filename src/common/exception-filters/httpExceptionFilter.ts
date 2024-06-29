import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        if (status === HttpStatus.BAD_REQUEST) {
            const errorsResponse = []
            const responseBody: any = exception.getResponse()

            responseBody.message.forEach( el => {
                errorsResponse.push(el)
            })
            response
                .status(status)
                .json({
                    errors: errorsResponse,
                });
        } else {
            response
                .status(status)
                .json({
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
        }
    }
}