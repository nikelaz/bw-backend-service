import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { validateOrReject, IsDecimal } from 'class-validator';
import { getIsInvalidMessage } from '../helper/validation-messages';
import { Category } from './Category';
import { Budget } from './Budget';
import { Transaction } from './Transaction';

@Entity()
export class CategoryBudget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDecimal(undefined, {
    message: getIsInvalidMessage('Month')
  })
  amount: number;

  @ManyToOne(() => Category, (category) => category.categoryBudgets)
  category: Category

  @ManyToOne(() => Budget, (budget) => budget.categoryBudgets)
  budget: Budget

  @OneToMany(() => Transaction, (transaction) => transaction.categoryBudget)
  transactions: Transaction[]

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
