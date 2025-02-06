import { FastifyPluginCallback } from 'fastify';
import { User } from '../models/user';
import { IIdParams, ISuccessfulReply } from './types/generic.types';
import { IUserBody, IUserReply, ILoginReply, IChangePasswordBody } from './types/user.types';
import { auth } from '../helpers/authenticated';
import { createCategory, createCategoryBudget } from '../helpers/seeding-shortcuts';
import { CategoryType } from '../models/category';
import { Budget } from '../models/budget';
import { Transaction } from '../models/transaction';
import { CategoryBudget } from '../models/category-budget';
import { Category } from '../models/category';

const newUserExperience = async (userId: number) => {
  // Create budget for the current month
  const budget = Budget.create({
    month: new Date(),
    user: {
      id: userId
    }
  });

  await budget.save();

  // Create categories
  // Income
  const salary = await createCategory(CategoryType.INCOME, 'Salary', userId);
  await createCategoryBudget(salary, 4800, budget);

  // Expenses
  const utilities = await createCategory(CategoryType.EXPENSE, 'Utilities', userId);
  await createCategoryBudget(utilities, 280, budget);
  const food = await createCategory(CategoryType.EXPENSE, 'Food', userId);
  await createCategoryBudget(food, 640, budget);
  const housing = await createCategory(CategoryType.EXPENSE, 'Housing', userId);
  await createCategoryBudget(housing, 1200, budget);
  const transportation = await createCategory(CategoryType.EXPENSE, 'Transportation', userId);
  await createCategoryBudget(transportation, 240, budget);
  const insurance = await createCategory(CategoryType.EXPENSE, 'Insurance', userId);
  await createCategoryBudget(insurance, 300, budget);
  const healthAndFitness = await createCategory(CategoryType.EXPENSE, 'Health & Fitness', userId);
  await createCategoryBudget(healthAndFitness, 150, budget);
  const personalCare = await createCategory(CategoryType.EXPENSE, 'Personal Care', userId);
  await createCategoryBudget(personalCare, 180, budget);
  const funAndEntertainment = await createCategory(CategoryType.EXPENSE, 'Fun & Entertainment', userId);
  await createCategoryBudget(funAndEntertainment, 200, budget);
  const misc = await createCategory(CategoryType.EXPENSE, 'Miscellaneous', userId);
  await createCategoryBudget(misc, 150, budget);
  const giving = await createCategory(CategoryType.EXPENSE, 'Giving', userId);
  await createCategoryBudget(giving, 240, budget);

  // Savings
  const emergencyFund = await createCategory(CategoryType.SAVINGS, 'Emergency Fund', userId, 14400);
  await createCategoryBudget(emergencyFund, 500, budget);
  const retirement = await createCategory(CategoryType.SAVINGS, 'Retirement', userId, 50000);
  await createCategoryBudget(retirement, 720, budget);
}

export const usersController: FastifyPluginCallback = (server, undefined, done) => {
  server.get<{
    Params: IIdParams,
    Reply: IUserReply
  }>('/:id', {
    ...auth(server)
  }, async (req, reply) => {
    if (parseInt(req.user.id.toString()) !== parseInt(req.params.id.toString())) throw new Error('Unauthorized');
    const user = await User.findOneBy({ id: req.params.id });
    if (!user) throw new Error('User not found');
    reply.code(200).send({ user });
  });

  server.post<{
    Body: IUserBody,
    Reply: IUserReply
  }>('/',
    async (req, reply) => {
    const user = User.create<User>(req.body.user);
    const newUser = await user.save();
    await newUserExperience(newUser.id);
    reply.code(200).send({ user: { ...newUser } });
  });

  server.post<{
    Body: IUserBody,
    Reply: ILoginReply
  }>('/login',
    async (req, reply) => {
    const invalidCredentialsError = 'The provided user details are invalid';

    const user = await User.findOneBy({ email: req.body.user.email });
    if (!user) throw new Error(invalidCredentialsError);

    const isPasswordValid = await user.isPasswordValid(req.body.user.password);
    if (!isPasswordValid) throw new Error(invalidCredentialsError);

    const token = server.jwt.sign({ ...user });
    reply.code(200).send({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        currency: user.currency,
        country: user.country,
      }
    });
  });

  server.post<{
    Body: IChangePasswordBody,
    Reply: ISuccessfulReply
  }>('/change-password', { ...auth(server) }, async (req, reply) => {
    const user = await User.findOneBy({ id: req.user.id });

    const isPasswordValid = await user.isPasswordValid(req.body.currentPassword);
    if (!isPasswordValid) throw new Error('Current password is invalid');

    user.password = req.body.newPassword;
    await user.save();

    reply.code(200).send({ message: 'Password updated successfully' });
  });

  server.put<{
    Body: IUserBody,
    Reply: ISuccessfulReply
  }>('/', {
    ...auth(server)
  }, async (req, reply) => {
    await User.update(req.user.id, req.body.user);
    reply.code(200).send({ message: 'User updated succesfully' });
  });

  server.delete<{
    Params: IIdParams,
    Reply: ISuccessfulReply
  }>('/:id', {
    ...auth(server)
  }, async (req, reply) => {
    if (parseInt(req.user.id.toString()) !== parseInt(req.params.id.toString())) throw new Error('Unauthorized');

    await Transaction.delete({ user: { id: req.params.id } });

    const budgets = await Budget.findBy({ user: { id: req.params.id } });

    await Promise.all(budgets.map(async (budget) => {
      await CategoryBudget.delete({ budget: budget });
    }));

    await Budget.delete({ user: { id: req.params.id } });
    await Category.delete({ user: { id: req.params.id } });

    await User.delete(req.params.id);
    reply.code(200).send({ message: 'User deleted succesfully' });
  });

  done();
};
