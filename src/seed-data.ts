import { User } from './models/user';
import { Budget } from './models/budget';
import { CategoryType } from './models/category';
import { createCategory, createCategoryBudget, createTransaction } from './helpers/seeding-shortcuts';

const consolePrefix = 'DATA SEEDING:';

export const seedData = async () => {
  console.log(consolePrefix, 'Creating users');
  const userObj = User.create<User>({
    email: 'testuser@budgetwarden.com',
    password: '123qwerty',
    firstName: 'John',
    lastName: 'Doe',
  });

  let user;

  try {
    user = await userObj.save();
  } catch(error) {
    console.log(consolePrefix, 'Data is already seeded, skip seeding process');
    return;
  }
  
  console.log(consolePrefix, 'Creating budgets');
  const budget = Budget.create({
    month: new Date(),
    user: {
      id: user.id
    }
  });

  await budget.save();

  const aMonthAgo = new Date();
  aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);

  const budget2 = Budget.create({
    month: aMonthAgo,
    user: {
      id: user.id
    }
  });

  await budget2.save();

  const aMonthForward = new Date();
  aMonthForward.setMonth(aMonthForward.getMonth() + 1);

  const budget3 = Budget.create({
    month: aMonthForward,
    user: {
      id: user.id
    }
  });

  await budget3.save();

  console.log(consolePrefix, 'Creating categories');

  const salaryCategory = await createCategory(CategoryType.INCOME, 'Salary', user.id);
  const foodCategory = await createCategory(CategoryType.EXPENSE, 'Food', user.id);
  const mortgageCategory = await createCategory(CategoryType.DEBT, 'Mortgage', user.id);
  const fundCategory = await createCategory(CategoryType.SAVINGS, 'Emergency Fund', user.id);

  const salaryCb = await createCategoryBudget(salaryCategory, 5000, budget);
  const foodCb = await createCategoryBudget(foodCategory, 500, budget);
  const mortgageCb = await createCategoryBudget(mortgageCategory, 1000, budget);
  const fundCb = await createCategoryBudget(fundCategory, 800, budget);

  const salaryCb2 = await createCategoryBudget(salaryCategory, 3500, budget2);
  const foodCb2 = await createCategoryBudget(foodCategory, 400, budget2);
  const mortgageCb2 = await createCategoryBudget(mortgageCategory, 1500, budget2);
  const fundCb2 = await createCategoryBudget(fundCategory, 200, budget2);

  const salaryCb3 = await createCategoryBudget(salaryCategory, 3200, budget3);
  const foodCb3 = await createCategoryBudget(foodCategory, 300, budget3);
  const mortgageCb3 = await createCategoryBudget(mortgageCategory, 1100, budget3);
  const fundCb3 = await createCategoryBudget(fundCategory, 350, budget3);

  console.log(consolePrefix, 'Creating transactions');
  await createTransaction(4000, new Date('2024-6-1'), salaryCb, user, 'Salary from Job #1');
  await createTransaction(200, new Date('2024-6-5'), foodCb, user, 'Groceries @ Supermarket');
  await createTransaction(1000, new Date('2024-6-2'), mortgageCb, user, 'June Mortgage Payment');
  await createTransaction(200, new Date('2024-6-6'), fundCb, user);

  await createTransaction(2000, new Date('2024-6-1'), salaryCb2, user, 'Salary from Job #2');
  await createTransaction(100, new Date('2024-6-5'), foodCb2, user, 'Food @ Supermarket');
  await createTransaction(200, new Date('2024-6-2'), mortgageCb2, user, 'July Mortgage Payment');
  await createTransaction(100, new Date('2024-6-6'), fundCb2, user, 'Emergency Fund Monthly Deposit');

  await createTransaction(2000, new Date('2024-6-1'), salaryCb3, user, 'Salary from Job #1');
  await createTransaction(100, new Date('2024-6-5'), foodCb3, user, 'Weekly Shopping');
  await createTransaction(200, new Date('2024-6-2'), mortgageCb3, user, 'August Mortgage Payment');
  await createTransaction(100, new Date('2024-6-6'), fundCb3, user);

  console.log(consolePrefix, 'Data Seeding Completed');
};
