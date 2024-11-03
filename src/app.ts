import 'reflect-metadata';
import express from 'express';
import { Container } from 'typedi';
import cors from 'cors';
import { promisify } from 'util';
import { getMetadataArgsStorage, RoutingControllersOptions, useContainer, useExpressServer } from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi'
import * as swaggerUiExpress from 'swagger-ui-express'
const { defaultMetadataStorage } = require('class-transformer/cjs/storage')

import SessionConfig from './core/session-config';
import { currentUserChecker, authorizationChecker } from './middlewares'
import { AuthController, ItemsController, PurchaseController } from './controllers';
import { ErrorHandler } from './middlewares';
import { PostgresDataSource } from './datasources';
import { ApplicationOptions } from './types/index';
import { LoggerService } from './services';

class Application {
  private app!: express.Application;
  private options: ApplicationOptions = { port: +(process.env.PORT ?? 3000) };
  private logger!: LoggerService;

  constructor(options?: ApplicationOptions) {
    if (options) {
      this.options = options
    }
    this.logger = Container.get(LoggerService);
  }

  async boot() {
    this.app = express();
    this.initializeMiddlewares();
    useContainer(Container);

    const routingControllersOptions: RoutingControllersOptions = {
      controllers: [
        AuthController,
        ItemsController,
        PurchaseController
      ],
      routePrefix: '/api',
    }

    useExpressServer(this.app, {
      ...routingControllersOptions,
      defaultErrorHandler: false,
      middlewares: [ErrorHandler],
      currentUserChecker,
      authorizationChecker
    });

    this.initializeOpenAPI(routingControllersOptions);
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    const sessionConfig = Container.get(SessionConfig);
    this.app.use(sessionConfig.configureSession());
    this.app.use(cors());
  }

  private initializeOpenAPI(routingControllersOptions: RoutingControllersOptions) {

    const storage = getMetadataArgsStorage()

    const schemas: any = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    })

    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            scheme: 'basic',
            name: 'connect.sid',
            in: 'cookie'
          }
        }
      },
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: 'A sample API for test task',
        version: '1.0.0',
      },
    })

    this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))
  }

  async start() {
    const { port } = this.options;
    const db = Container.get(PostgresDataSource);
    await db.checkConnection();

    const serverListen: any = promisify(this.app.listen.bind(this.app));
    await serverListen(port);

    this.logger.logInfo(`App start on port: ${port}`)
  }

  async stop() {
    const dbConnection = Container.get(PostgresDataSource);
    // Gracefully close db connection
    await dbConnection.closeConnection();
  }
}

export default Application;
