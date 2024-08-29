import { Transaction } from '../models/transaction';
import { CategoryBudget } from '../models/category-budget';
import { CategoryType, Category } from '../models/category';
import { Budget } from '../models/budget';
import { User } from '../models/user';


export const createCategory = async (type: CategoryType, title: string, userId: number, accAmount?: number) => {
  const category = Category.create<Category>({
    type,
    title,
    user: {
      id: userId
    },
    accAmount: accAmount || 0
  });

  try {
    await category.save();
  } catch (error) {
    console.log('error', error.toString());
  }

  return category;
};

export const createCategoryBudget = async (category: Category, amount: number, budget: Budget) => {
  const categoryBudget = CategoryBudget.create<CategoryBudget>({
    amount,
    budget,
    category,
  });

  await categoryBudget.save();

  return categoryBudget;
};

export const createTransaction = async (
  amount: number,
  date: Date,
  categoryBudget: CategoryBudget,
  user: User,
  title?: string
) => {
  const transaction = Transaction.create<Transaction>({
    title,
    amount,
    date,
    categoryBudget,
    user
  });

  await transaction.save();

  return transaction;
};