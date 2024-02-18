import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from 'typeorm';
import ExtendedBaseEntity from './extended-base-entity';
import { IsDecimal } from 'class-validator';
import { getIsInvalidMessage } from '../helpers/validation-messages';
import { Category } from './category';
import { Budget } from './budget';
import { Transaction } from './transaction';

@Entity()
export class CategoryBudget extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDecimal(undefined, { message: getIsInvalidMessage('Month') })
  amount: number;

  @ManyToOne(() => Category, (category) => category.categoryBudgets)
  category: Category;

  @ManyToOne(() => Budget, (budget) => budget.categoryBudgets)
  budget: Budget;

  @OneToMany(() => Transaction, (transaction) => transaction.categoryBudget)
  transactions: Transaction[];
}
