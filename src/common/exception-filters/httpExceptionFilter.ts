import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();


        switch (status) {
            case HttpStatus.BAD_REQUEST:
                const errorsResponse = []
                const responseBody: any = exception.getResponse()

                if (Array.isArray(responseBody.message)) {
                    responseBody.message.forEach((e) =>
                        errorsResponse.push(e),
                    );
                } else {
                    errorsResponse.push(responseBody.message);
                }

                response
                    .status(status)
                    .json({
                        errors: errorsResponse,
                    });
                break

            case HttpStatus.NOT_FOUND:
            case HttpStatus.UNAUTHORIZED:
                response
                    .status(status)
                    .send()
                break

            default:
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