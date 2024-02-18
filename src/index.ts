import 'reflect-metadata';
import { AppDataSource } from './data-source';

class Application {
  static async main() {
    await AppDataSource.initialize();
  }
}

Application.main();
