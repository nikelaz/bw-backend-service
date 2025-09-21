import { FastifyPluginCallback } from 'fastify';
import { auth } from '../helpers/authenticated';
import { IBudgetCreateBody, IBudgetReply, IBudgetsReply } from './types/budget.types';
import { CategoryBudget } from '../models/category-budget';
import { Budget } from '../models/budget';
import { Transaction } from '../models/transaction';
import { IIdParams, ISuccessfulReply } from './types/generic.types';

export const budgetsController: FastifyPluginCallback = (server, undefined, done) => {
  server.get<{
    Reply: IBudgetsReply
  }>('/', {
    ...auth(server)
  }, async (req, reply) => {
    const budgets = await Budget.find({
      where: {
        user: { id: req.user.id }
      },
      relations: ['categoryBudgets'],
      order: {
        month: 'ASC'
      }
    });
    reply.code(200).send({ budgets });
  });

  server.get<{
    Params: IIdParams
    Reply: IBudgetReply
  }>('/:id', {
    ...auth(server)
  }, async (req, reply) => {
    const budget = await Budget.findOne({
      where: {
        user: { id: req.user.id },
        id: req.params.id
      },
      relations: ['categoryBudgets']
    });

    if (!budget) throw new Error('Budget not found');

    reply.code(200).send({ budget });
  });

  server.post<{
    Body: IBudgetCreateBody
    Reply: IBudgetReply
  }>('/', {
    ...auth(server)
  }, async (req, reply) => {
    const budget = Budget.create({
      month: new Date(req.body.budget.month),
      user: {
        id: req.user.id
      }
    });

    const newBudget = await budget.save();

    const referenceBudget = await Budget.findOne({
      where: {
        id: req.body.copyFrom.id,
        user: { id: req.user.id }
      },
      relations: ['categoryBudgets'],
      order: {
        month: 'ASC'
      }
    });

    if (referenceBudget) {
      const newCategoryBudgetCreationPromises: Array<Promise<CategoryBudget>> = [];

      referenceBudget.categoryBudgets.forEach((categoryBudget: CategoryBudget) => {
        const newCategoryBudget = CategoryBudget.create({
          amount: categoryBudget.amount,
          category: categoryBudget.category,
          budget: newBudget,
        });

        newCategoryBudgetCreationPromises.push(newCategoryBudget.save());
      });

      await Promise.all(newCategoryBudgetCreationPromises);
    }

    reply.code(200).send({ budget: newBudget });
  });
  server.delete<{
    Params: IIdParams
    Reply: ISuccessfulReply
  }>('/:id', {
    ...auth(server)
  }, async (req, reply) => {
    const allBudgets = await Budget.find({
      where: {
        user: {
          id: req.user.id,
        }
      },
    });

    if (allBudgets.length < 2) {
      throw new Error("You are trying to delete your only budget. A user must always have at least one budget.");
    }

    const categoryBudgets = await CategoryBudget
      .createQueryBuilder('categoryBudget')
      .leftJoinAndSelect('categoryBudget.transactions', 'transaction')
      .leftJoinAndSelect('categoryBudget.budget', 'budget')
      .leftJoinAndSelect('budget.user', 'user')
      .where('budget.id = :budgetId', { budgetId: req.params.id })
      .andWhere('user.id = :userId', { userId: req.user.id })
      .getMany();

    // Delete all transactions related to each category budget
    await Promise.all(
      categoryBudgets.map(async (categoryBudget) => {
        if (categoryBudget.transactions && categoryBudget.transactions.length > 0) {
          await Transaction.delete({
            categoryBudget: { id: categoryBudget.id },
          });
        }
      })
    );

    // Delete all category budgets related to the budget
    await CategoryBudget.delete({
      budget: { id: req.params.id },
    });

    // Delete the budget itself
    await Budget.delete({
      id: req.params.id,
      user: {
        id: req.user.id,
      },
    });

    reply.code(200).send({ message: 'Budget and related data deleted successfully' });
  });
  done();
};
