import { IncomingMessage } from 'http';
import * as morgan from 'morgan';
import { Logger } from './logger';

const stream: morgan.StreamOptions = {
  write: (message: any) => Logger.http(message),
};

morgan.token('req-body', (req: IncomingMessage) => {
  return JSON.stringify((<any>req).body);
});

morgan.token('req-ip', (req: IncomingMessage) => {
  return (<any>req).clientIp;
});

// TODO: Find a way to log response body
const morganMiddleware = morgan(':method :url :status :req-body :req-ip', {
  stream,
});

export { morganMiddleware };
