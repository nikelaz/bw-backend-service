import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import ExtendedBaseEntity from './extended-base-entity';
import { IsDate, IsOptional } from 'class-validator';
import { getIsInvalidMessage } from '../helpers/validation-messages';
import { CategoryBudget } from './category-budget';
import { User } from './user';

@Entity()
export class Transaction extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsOptional()
  title: string;

  @Column('double precision')
  amount: number;

  @Column()
  @IsDate({ message: getIsInvalidMessage('Date') })
  date: Date;

  @ManyToOne(() => CategoryBudget, (categoryBudget) => categoryBudget.transactions)
  categoryBudget: CategoryBudget;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
