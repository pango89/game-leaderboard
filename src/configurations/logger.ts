import * as winston from 'winston';
import { id } from 'cls-rtracer';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'white',
  debug: 'magenta',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: [${id() ? id() : ' '}] ${info.message}`,
  ),
);

const transports = [new winston.transports.Console()];

const options = {
  level: process.env.LOG_LEVEL,
  levels,
  format,
  transports,
};

const Logger = winston.createLogger(options);

export { options, Logger };
