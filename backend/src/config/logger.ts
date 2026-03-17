// import pino from 'pino';
// import pinoHttp from 'pino-http';
//
// import { env } from './env';
//
// export const logger = pino({
//   level: env.isProd ? 'info' : 'debug',
//   transport: env.isProd
//     ? undefined
//     : {
//         target: 'pino-pretty',
//         options: {
//           colorize: true,
//           translateTime: 'HH:HH:ss',
//           ignore: 'pid,hostname',
//           singleLine: true,
//         },
//       },
//   redact: {
//     paths: [
//       'req.headers.authorization',
//       'req.headers.cookie',
//       'req.body.password',
//       'res.headers.set-cookie',
//     ],
//     remove: true,
//   },
// });
//
// export const httpLogger = pinoHttp({
//   logger,
//   autoLogging: true,
//   // Use incoming X-Request-ID if present, else generate one
//   genReqId: (req) => {
//     const id = (req.headers['x-request-id'] as string) || crypto.randomUUID();
//     req.id = id;
//     return id;
//   },
//   customLogLevel: (_req, res, err) => {
//     if (err || res.statusCode >= 500) return 'error';
//     if (res.statusCode >= 400) return 'warn';
//     return 'info';
//   },
// });

import { IncomingMessage, ServerResponse } from 'node:http';

import pino from 'pino';
import pinoHttp from 'pino-http';

import { env } from './env';

const transport = env.isProd
  ? undefined
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname', // don't print useless metadata
      },
    };

export const logger = pino({
  level: env.isProd ? 'info' : 'debug',
  transport,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'res.headers.set-cookie',
    ],
    remove: true,
  },
});

export const httpLogger = pinoHttp({
  logger,
  customSuccessMessage(req: IncomingMessage, res: ServerResponse): string {
    return `${res.req.method} ${res.req.url} ${res.statusCode}`;
  },
  customErrorMessage(_req, res, err) {
    return `ERROR ${res.req.method} ${res.req.url}: ${err?.message}`;
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
  },
  serializers: {
    request(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
    response(res) {
      return {
        status: res.statusCode,
      };
    },
  },
});
