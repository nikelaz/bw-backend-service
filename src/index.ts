import 'reflect-metadata';
import { AppDataSource } from './data-source';
import fastify, { FastifyInstance } from 'fastify';
import config from './config';
import { userController } from './controllers/user-controller';
import auth from './plugins/auth';

class Application {
  server: FastifyInstance;

  constructor() {
    this.server = fastify();
  }

  async startHttpServer() {
    try {
      const address = await this.server.listen({ port: config.port});
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
    this.server.register(userController, { prefix: `${config.apiPrefix}/users` });
  }

  async main() {
    await AppDataSource.initialize();
    this.registerPlugins();
    this.registerControllers();
    await this.startHttpServer();
  }
}

const appInstance = new Application();
appInstance.main();
