import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  OneToMany
} from 'typeorm';
import { validateOrReject, IsDate } from 'class-validator';
import { getIsInvalidMessage } from '../helper/validation-messages';
import { CategoryBudget } from './category-budget';

@Entity()
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate({
    message: getIsInvalidMessage('Month')
  })
  month: Date;

  @OneToMany(() => CategoryBudget, (categoryBudget) => categoryBudget.budget)
  categoryBudgets: CategoryBudget[]

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
