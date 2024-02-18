import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne
} from 'typeorm';
import { validateOrReject, IsDecimal, IsDate } from 'class-validator';
import { getIsInvalidMessage } from '../helper/validation-messages';
import { CategoryBudget } from './category-budget';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDecimal(undefined, {
    message: getIsInvalidMessage('Amount')
  })
  amount: number;

  @Column()
  @IsDate({
    message: getIsInvalidMessage('Date')
  })
  date: Date;

  @ManyToOne(() => CategoryBudget, (categoryBudget) => categoryBudget.transactions)
  categoryBudget: CategoryBudget

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
