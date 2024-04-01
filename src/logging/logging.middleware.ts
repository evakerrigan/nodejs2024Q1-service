import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CustomLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(CustomLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const msg = `${method} ${baseUrl} Status: ${statusCode} Body: ${JSON.stringify(body)} Query: ${JSON.stringify(query)}`;

      if (statusCode < 400) {
        this.logger.log(msg);
      } else if (statusCode < 500) {
        this.logger.warn(msg);
      } else {
        this.logger.error(msg);
      }
    });

    next();
  }
}
