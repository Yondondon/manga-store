import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | string[];
    let error: string;

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const res = exceptionResponse as Record<string, unknown>;
      message = res.message as string | string[];
      error = (res.error as string) ?? HttpStatus[status];
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = HttpStatus[status];
    } else if (exception instanceof Error) {
      message = exception.message;
      error = HttpStatus[status];
    } else {
      message = 'Internal server error';
      error = HttpStatus[status];
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
    });
  }
}
