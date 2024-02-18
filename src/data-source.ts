import { DataSource } from 'typeorm';
import { User } from './models/user';
import { Transaction } from './models/transaction';
import { Budget } from './models/budget';
import { CategoryBudget } from './models/category-budget';
import { Category } from './models/category';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'bw',
  synchronize: true,
  logging: false,
  entities: [ User, Transaction, Budget, CategoryBudget, Category ]
});
