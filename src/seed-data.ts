import { User } from './models/user';
import { Budget } from './models/budget';
import { CategoryBudget } from './models/category-budget';
import { CategoryType, Category } from './models/category';
import { Transaction } from './models/transaction';

const consolePrefix = 'DATA SEEDING:';

const createCategory = async (type: CategoryType, title: string, userId: number) => {
  const category = Category.create<Category>({
    type,
    title,
    user: {
      id: userId
    }
  });

  await category.save();

  return category;
};

const createCategoryBudget = async (category: Category, amount: number, budget: Budget) => {
  const categoryBudget = CategoryBudget.create<CategoryBudget>({
    amount,
    budget,
    category
  });

  await categoryBudget.save();

  return categoryBudget;
};

const createTransaction = async (
  amount: number,
  date: Date,
  categoryBudget: CategoryBudget,
  user: User
) => {
  const transaction = Transaction.create<Transaction>({
    amount,
    date,
    categoryBudget,
    user
  });

  await transaction.save();

  return transaction;
};

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

  console.log(consolePrefix, 'Creating categories');

  const salaryCategory = await createCategory(CategoryType.INCOME, 'Salary', user.id);
  const foodCategory = await createCategory(CategoryType.EXPENSE, 'Food', user.id);
  const mortgageCategory = await createCategory(CategoryType.DEBT, 'Mortgage', user.id);
  const fundCategory = await createCategory(CategoryType.SAVINGS, 'Emergency Fund', user.id);

  const salaryCb = await createCategoryBudget(salaryCategory, 5000, budget);
  const foodCb = await createCategoryBudget(foodCategory, 500, budget);
  const mortgageCb = await createCategoryBudget(mortgageCategory, 1000, budget);
  const fundCb = await createCategoryBudget(fundCategory, 800, budget);

  console.log(consolePrefix, 'Creating transactions');
  await createTransaction(4000, new Date('2024-6-1'), salaryCb, user);
  await createTransaction(200, new Date('2024-6-5'), foodCb, user);
  await createTransaction(1000, new Date('2024-6-2'), mortgageCb, user);
  await createTransaction(200, new Date('2024-6-6'), fundCb, user);
};
