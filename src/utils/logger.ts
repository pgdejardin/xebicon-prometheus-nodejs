/* tslint:disable:no-console */

import * as chalk from 'chalk';
import * as ip from 'ip';
import * as winston from 'winston';

const env = process.env.NODE_ENV;
const divider = chalk.gray('\n-----------------------------------');

/**
 * Logger middleware, you can customize it to make messages more personal
 */

const logger = new winston.Logger({
  colors: {
    trace: 'gray',
  },
  transports: [],
  exitOnError: false,
});

function logLevel(): string {
  switch (env) {
    case 'development':
      return 'debug';
    default:
      return 'info';
  }
}

logger.add(winston.transports.Console, {
  handleExceptions: true,
  humanReadableUnhandledException: true,
  level: process.env.LOG_LEVEL || logLevel(),
  timestamp: () => new Date().toISOString(),
  colorize: true,
  json: env !== 'development',
  stringify: obj => JSON.stringify(obj, null, 2),
});

export function errorToString(err) {
  if (err instanceof Error) {
    return JSON.stringify(err, ['message', 'arguments', 'type', 'name', 'stack']);
  }
  return JSON.stringify(err);
}

// Called when express.js app starts on given port w/o errors
export const appStarted = (port, host) => {
  console.log(`Server started ! ${chalk.green('✓')}`);

  console.log(`
${chalk.bold('Access URLs:')}${divider}
Localhost: ${chalk.magenta(`http://${host}:${port}`)}
      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`)}${divider}
${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
`);
};

export default logger;
