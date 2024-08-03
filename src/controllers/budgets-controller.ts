import { FastifyPluginCallback } from 'fastify';
import { auth } from '../helpers/authenticated';
import { IBudgetCreateBody, IBudgetReply, IBudgetsReply } from './types/budget.types';
import { CategoryBudget } from '../models/category-budget';
import { Budget } from '../models/budget';
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
    await Budget.delete({
      id: req.params.id,
      user: {
        id: req.user.id
      }
    });
    reply.code(200).send({ message: 'Budget deleted successfully' });
  });

  done();
};
