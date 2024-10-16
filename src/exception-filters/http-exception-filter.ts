import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { id } from 'cls-rtracer';
import { ERRORS } from '../configurations/error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let exceptionResponse = exception.getResponse();

    if (!exception || !status)
      exceptionResponse = new InternalServerErrorException(
        ERRORS.DEFAULT_ERROR_CODE,
      ).getResponse();

    if (ERRORS[exceptionResponse['message']]) {
      const errorCode = exceptionResponse['message'];
      exceptionResponse['message'] =
        ERRORS[exceptionResponse['message']].message;

      exceptionResponse['code'] = errorCode;
    }

    const responseBody = {
      statusCode: status,
      message:
        exceptionResponse['message'] ?? ERRORS.DEFAULT_ERROR_CODE.message,
      error: exceptionResponse['error'],
      code: exceptionResponse['code'] ?? ERRORS.DEFAULT_ERROR_CODE.code,
      traceId: id(),
    };

    this.logger.debug(responseBody);
    response.status(status).json(responseBody);
  }
}
