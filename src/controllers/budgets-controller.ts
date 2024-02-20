import { FastifyPluginCallback } from 'fastify';
import { auth } from '../helpers/authenticated';
import { IBudgetBody, IBudgetReply, IBudgetsReply } from './types/budget.types';
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
      relations: ['categoryBudgets']
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
    Body: IBudgetBody
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
