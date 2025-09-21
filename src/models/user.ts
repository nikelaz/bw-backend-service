import { Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  OneToMany,
} from 'typeorm';
import { IsEmail, Matches, Length, IsOptional, IsEnum } from 'class-validator';
import { getIsInvalidMessage } from '../helpers/validation-messages';
import * as bcrypt from 'bcrypt';
import { Category } from './category';
import ExtendedBaseEntity from './extended-base-entity';
import { Budget } from './budget';
import { Transaction } from './transaction';
import CRMOperations from '../helpers/crm-ops';

export enum OAuthProvider {
  GOOGLE = 1,
  APPLE = 2,
};

@Entity()
@Unique(['email'])
export class User extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail(undefined, { message: getIsInvalidMessage('Email') })
  email: string;

  @Column({ nullable: true })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, {
    message: `${getIsInvalidMessage('Password')}. Use a password with at least 8 symbols, that includes at least 1 letter and a digit.`
  })
  @IsOptional()
  password: string;

  @Column()
  @Length(1, 50, { message: getIsInvalidMessage('First Name') })
  firstName: string;

  @Column()
  @Length(1, 50, { message: getIsInvalidMessage('Last Name') })
  lastName: string;

  @Column({ nullable: true })
  @IsOptional()
  country: string;

  @Column({ default: 'USD' })
  @Length(3, 3, { message: getIsInvalidMessage('Currency') })
  @IsOptional()
  currency: string;

  @Column({
    type: 'enum',
    enum: OAuthProvider,
    nullable: true,
  })
  @IsEnum(OAuthProvider, { message: getIsInvalidMessage('Type') })
  @IsOptional()
  oAuthProvider: OAuthProvider;

  @Column({ nullable: true })
  @IsOptional()
  oAuthId: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[]

  // This property stores a cached password used to check
  // if the password was changed during an update
  cachedPassword: string;

  @AfterLoad()
  cachePassword() {
    if (!this.password) return;
    this.cachedPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    if (this.cachedPassword === this.password) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  @BeforeInsert()
  async createCRMContact() {
    //const crmContactId = await CRMOperations.createCRMContact(this);
    //CRMOperations.addCRMContactToUsersList(crmContactId);
  }

  async isPasswordValid(inputPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, this.password);
  }
}
