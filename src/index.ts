import 'reflect-metadata';
import { AppDataSource } from './data-source';
import fastify, { FastifyInstance } from 'fastify';
import config from './config';
import auth from './plugins/auth';
import { usersController } from './controllers/users-controller';
import { budgetsController } from './controllers/budgets-controller';
import { transactionsController } from './controllers/transactions-controller';
import { categoryBudgetsController } from './controllers/category-budgets-controller';
import { seedData } from './seed-data';

class Application {
  server: FastifyInstance;

  constructor() {
    this.server = fastify();
  }

  async startHttpServer() {
    try {
      const address = await this.server.listen({
        host: config.host,
        port: config.port
      });
      console.log(`Server listening at ${address}`);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  registerPlugins() {
    this.server.register(auth);
  }

  registerControllers() {
    this.server.register(usersController, { prefix: `${config.apiPrefix}/users` });
    this.server.register(budgetsController, { prefix: `${config.apiPrefix}/budgets` });
    this.server.register(transactionsController, { prefix: `${config.apiPrefix}/transactions` });
    this.server.register(categoryBudgetsController, { prefix: `${config.apiPrefix}/category-budgets` });
  }

  async main() {
    await AppDataSource.initialize();
    this.registerPlugins();
    this.registerControllers();
    await this.startHttpServer();
    await seedData();
  }
}

const appInstance = new Application();
appInstance.main();
