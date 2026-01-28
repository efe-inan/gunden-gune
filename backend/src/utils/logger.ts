import winston from 'winston';
import { format } from 'util';

const winstonLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${level.toUpperCase()}] ${timestamp} - ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

const logger = {
  info: (message: string, ...args: any[]) => {
    setImmediate(() => winstonLogger.info(format(message, ...args)));
  },
  error: (message: string, error?: any) => {
    // Keep error logging synchronous to ensure visibility in case of crash
    winstonLogger.error(format(message, error || ''));
  },
  warn: (message: string, ...args: any[]) => {
    setImmediate(() => winstonLogger.warn(format(message, ...args)));
  },
  debug: (message: string, ...args: any[]) => {
    setImmediate(() => winstonLogger.debug(format(message, ...args)));
  },
};

export default logger;
