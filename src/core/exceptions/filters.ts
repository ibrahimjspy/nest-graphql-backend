import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const ctxResponse = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const response: any = exception.getResponse();
    const message =
      typeof response !== 'string' ? response.message[0] : response;

    ctxResponse.status(status).json({
      message: message,
    });
  }
}
