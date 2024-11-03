import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import Application from './app';
import Container from 'typedi';
import { LoggerService } from './services';

const logger = Container.get(LoggerService);
const port = + (process.env.PORT || 3000);

async function main() {
  const app = new Application({ port });

  await app.boot();
  await app.start()

  function shutdown() {
    void app.stop().then(() => {
      logger.logInfo('SIGTERM app stop');
      process.exit(0);
    })
  }
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

}

main().catch(err => {
  logger.logError(`Cannot start the application: ${err.message}`);
  process.exit(1);
});