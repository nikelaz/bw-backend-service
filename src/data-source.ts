import { DataSource } from 'typeorm';
import { User } from './models/user';
import { Transaction } from './models/transaction';
import { Budget } from './models/budget';
import { CategoryBudget } from './models/category-budget';
import { Category } from './models/category';
import config from './config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.username,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: true,
  logging: false,
  entities: [ User, Transaction, Budget, CategoryBudget, Category ]
});
