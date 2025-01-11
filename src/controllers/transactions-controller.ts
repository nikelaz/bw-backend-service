import { FastifyPluginCallback } from 'fastify';
import { auth } from '../helpers/authenticated';
import { IBudgetIdParams, IBudgetIdSingleParams, IPaginationQuery, ITransactionBody, ITransactionReply, ITransactionsReply } from './types/transaction.types';
import { Transaction } from '../models/transaction';
import { IIdParams, ISuccessfulReply } from './types/generic.types';
import { ILike } from 'typeorm';

export const transactionsController: FastifyPluginCallback = (server, undefined, done) => {
  server.get<{
    Params: IBudgetIdParams,
    Reply: ITransactionsReply,
    Querystring: IPaginationQuery,
  }>('/:budgetId', {
    ...auth(server)
  }, async (req, reply) => {
    let whereObj: any = {
      categoryBudget: {
        budget: { id: req.params.budgetId }
      },
      user: { id: req.user.id }
    };

    if (req.query.filter) {
      whereObj = [
        {
          ...whereObj,
          title: ILike(`%${req.query.filter}%`)
        },
        {
          ...whereObj,
          categoryBudget: {
            budget: { id: req.params.budgetId },
            category: {
              title: ILike(`%${req.query.filter}%`)
            }
          }
        },
      ];
    }

    const [transactions, count] = await Transaction.findAndCount({
      where: whereObj,
      relations: ['categoryBudget'],
      take: req.query.limit || null,
      skip: req.query.offset || null,
      order: {
        date: 'DESC',
      },
    });

    reply.code(200).send({ transactions, count });
  });

  server.get<{
    Params: IBudgetIdSingleParams,
    Reply: ITransactionReply
  }>('/:budgetId/:id', {
    ...auth(server)
  }, async (req, reply) => {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        categoryBudget: {
          budget: { id: req.params.budgetId }
        },
        user: { id: req.user.id }
      },
      relations: ['categoryBudget'],
    });

    if (!transaction) throw new Error('Transaction not found.');

    reply.code(200).send({ transaction });
  });

  server.post<{
    Body: ITransactionBody,
    Reply: ITransactionReply
  }>('/', {
    ...auth(server)
  }, async (req, reply) => {
    const transaction = Transaction.create({
      ...req.body.transaction,
      date: new Date(req.body.transaction.date),
      user: {
        id: req.user.id
      }
    });

    const newTransaction = await transaction.save();
    reply.code(200).send({ transaction: newTransaction });
  });

  server.put<{
    Body: ITransactionBody,
    Reply: ISuccessfulReply
  }>('/', {
    ...auth(server)
  }, async (req, reply) => {
    await Transaction.update({
      id: req.body.transaction.id,
      user: { id: req.user.id }
    }, req.body.transaction);

    reply.code(200).send({ message: 'Transaction updated successfuly' });
  });

  server.delete<{
    Params: IIdParams,
    Reply: ISuccessfulReply
  }>('/:id', {
    ...auth(server)
  }, async (req, reply) => {
    await Transaction.delete({
      id: req.params.id,
      user: { id: req.user.id }
    });

    reply.code(200).send({ message: 'Transaction deleted successfuly' });
  });

  done();
};
