import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import ExtendedBaseEntity from './extended-base-entity';
import { IsDate } from 'class-validator';
import { getIsInvalidMessage } from '../helpers/validation-messages';
import { CategoryBudget } from './category-budget';

@Entity()
export class Budget extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate({ message: getIsInvalidMessage('Month') })
  month: Date;

  @OneToMany(() => CategoryBudget, (categoryBudget) => categoryBudget.budget)
  categoryBudgets: CategoryBudget[];
}
