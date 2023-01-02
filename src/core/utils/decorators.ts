import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const IsAuthenticated = createParamDecorator(
  (data: string, executionContext: ExecutionContext) => {
    const context = executionContext.switchToHttp();
    const request = context.getRequest<Request>();

    const token = request.headers ? request.headers?.[data] : '';
    if (!token)
      throw new HttpException(
        { error: 'UnAuthorize' },
        HttpStatus.UNAUTHORIZED,
      );
    return token;
  },
);
