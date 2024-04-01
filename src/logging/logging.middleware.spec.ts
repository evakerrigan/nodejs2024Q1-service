import { CustomLoggerMiddleware } from './logging.middleware';

describe('LoggingMiddleware', () => {
  it('should be defined', () => {
    expect(new CustomLoggerMiddleware()).toBeDefined();
  });
});
