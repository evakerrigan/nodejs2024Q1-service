import { ConsoleLogger, Injectable } from '@nestjs/common';
import { join } from 'path';
import { createWriteStream, existsSync } from 'fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';

export enum LogLevels {
  log = 'log',
  error = 'error',
  warn = 'warn',
  debug = 'debug',
  verbose = 'verbose',
}

@Injectable()
export class LoggingService extends ConsoleLogger {
  private level: number;
  private lCount: number;
  private eCount: number;

  constructor() {
    super();
    this.level = +process.env.LOG_LEVEL || 2;
    this.lCount = 0;
    this.eCount = 0;
  }

  private async writeLog(level: string, msg: string, context: string) {
    const message = `[${this.getTimestamp()}] - [${level.toUpperCase()}] - [${context || ''}] - [${msg}]\n`;

    super[level](msg);

    level === LogLevels.error
      ? (this.eCount = await this.writeToFile(this.eCount, message, 'errors'))
      : (this.lCount = await this.writeToFile(this.lCount, message, 'logs'));
  }

  private async writeToFile(count: number, msg: string, file: string) {
    const logPath = join(__dirname, '..', '..', 'logs');
    await mkdir(logPath, { recursive: true });

    let filePath = join(logPath, `${count}.${file}.log`);
    if (!existsSync(filePath)) {
      await writeFile(filePath, '');
    }

    const { size } = await stat(filePath);
    if (size >= parseInt(process.env.MAX_LOG_SIZE || '50000')) {
      count++;
      filePath = join(logPath, `${count}.${file}.log`);
      await writeFile(filePath, '');
    }

    const writeStream = createWriteStream(filePath, { flags: 'a' });
    writeStream.write(msg);
    writeStream.end();

    return count;
  }

  error(msg: string, trace: string, context?: string) {
    if (this.level >= 0)
      this.writeLog(
        LogLevels.error,
        `${msg}\n${trace}`,
        context || this.context,
      );
  }

  warn(msg: string, context: string) {
    if (this.level >= 1)
      this.writeLog(LogLevels.warn, `${msg}`, context || this.context);
  }

  log(msg: string, context: string) {
    if (this.level >= 2)
      this.writeLog(LogLevels.log, `${msg}`, context || this.context);
  }

  verbose(msg: string, context: string) {
    if (this.level >= 3)
      this.writeLog(LogLevels.verbose, `${msg}`, context || this.context);
  }

  debug(msg: string, context: string) {
    if (this.level >= 4)
      this.writeLog(LogLevels.debug, `${msg}`, context || this.context);
  }
}
