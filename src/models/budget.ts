import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne
} from 'typeorm';
import ExtendedBaseEntity from './extended-base-entity';
import { IsDate } from 'class-validator';
import { getIsInvalidMessage } from '../helpers/validation-messages';
import { CategoryBudget } from './category-budget';
import { User } from './user';

@Entity()
export class Budget extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate({ message: getIsInvalidMessage('Month') })
  month: Date;

  @OneToMany(() => CategoryBudget, (categoryBudget) => categoryBudget.budget)
  categoryBudgets: CategoryBudget[];

  @ManyToOne(() => User, (user) => user.budgets)
  user: User;
}
