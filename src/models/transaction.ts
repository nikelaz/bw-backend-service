import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import ExtendedBaseEntity from './extended-base-entity';
import { IsDecimal, IsDate } from 'class-validator';
import { getIsInvalidMessage } from '../helpers/validation-messages';
import { CategoryBudget } from './category-budget';

@Entity()
export class Transaction extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDecimal(undefined, { message: getIsInvalidMessage('Amount') })
  amount: number;

  @Column()
  @IsDate({ message: getIsInvalidMessage('Date') })
  date: Date;

  @ManyToOne(() => CategoryBudget, (categoryBudget) => categoryBudget.transactions)
  categoryBudget: CategoryBudget;
}
