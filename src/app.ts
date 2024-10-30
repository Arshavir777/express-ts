import 'reflect-metadata';
import express, { Application } from 'express';
import { router } from './decorators/controller.decorator';
import './controllers';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use(router)
  }
}

export default App;
