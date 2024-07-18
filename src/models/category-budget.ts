import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';
import ExtendedBaseEntity from './extended-base-entity';
import { Category } from './category';
import { Budget } from './budget';
import { Transaction } from './transaction';

@Entity()
export class CategoryBudget extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double precision')
  amount: number;

  @ManyToOne(() => Category, (category) => category.categoryBudgets, {
    eager: true
  })
  category: Category;

  @ManyToOne(() => Budget, (budget) => budget.categoryBudgets)
  budget: Budget;

  @OneToMany(() => Transaction, (transaction) => transaction.categoryBudget, {
    eager: true
  })
  transactions: Transaction[];

  currentAmount: number;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateCurrentAmount(): void {
    if (!this.transactions) return;
    this.currentAmount = this.transactions.reduce((acc, currValue) => acc + currValue.amount, 0);
  }
}
