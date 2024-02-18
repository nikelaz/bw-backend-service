import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './models/User';
import { Transaction } from './models/Transaction';
import { Budget } from './models/Budget';
import { CategoryBudget } from './models/CategoryBudget';
import { Category } from './models/Category';

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
