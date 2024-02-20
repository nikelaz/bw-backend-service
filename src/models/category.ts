import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from 'typeorm';
import ExtendedBaseEntity from './extended-base-entity';
import { IsDecimal, Length, IsEnum, IsOptional } from 'class-validator';
import { getIsInvalidMessage } from '../helpers/validation-messages';
import { User } from './user';
import { CategoryBudget } from './category-budget';

export enum CategoryType {
  INCOME = 0,
  EXPENSE = 1,
  SAVINGS = 2,
  DEBT = 3
};

@Entity()
export class Category extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  @IsEnum(CategoryType, { message: getIsInvalidMessage('Type') })
  type: CategoryType;

  @Column()
  @Length(1, 50, { message: getIsInvalidMessage('Title') })
  title: string;

  @Column('double precision', { nullable: true })
  @IsDecimal(undefined, { message: getIsInvalidMessage('Accumulated Amount') })
  @IsOptional()
  accAmount: number;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @OneToMany(() => CategoryBudget, (categoryBudget) => categoryBudget.category)
  categoryBudgets: CategoryBudget[];
}
