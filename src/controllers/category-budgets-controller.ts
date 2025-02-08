import { FastifyPluginCallback } from 'fastify';
import { auth } from '../helpers/authenticated';
import { IIdParams, ISuccessfulReply } from './types/generic.types';
import { ICategoryBudget } from './types/category-budgets.types';
import { CategoryBudget } from '../models/category-budget';
import { Category } from '../models/category';
import { DeepPartial } from 'typeorm';
import { Transaction } from '../models/transaction';

export const categoryBudgetsController: FastifyPluginCallback = (server, undefined, done) => {
  server.get<{
    Params: IIdParams,
    Reply: ICategoryBudget
  }>('/:id', {
    ...auth(server)
  }, async (req, reply) => {
    const categoryBudget = await CategoryBudget.findOne({
      where: {
        id: req.params.id,
        category: {
          user: { id: req.user.id }
        }
      }
    });

    if (!categoryBudget) throw new Error('Category budget not found');

    reply.code(200).send({ categoryBudget });
  });

  server.post<{
    Body: ICategoryBudget,
    Reply: ICategoryBudget
  }>('/', {
    ...auth(server)
  }, async (req, reply) => {
     const categoryBudget = CategoryBudget.create<CategoryBudget>(req.body.categoryBudget);

    if (!req.body.categoryBudget.category.id) {
      const newCategory = Category.create({
        ...req.body.categoryBudget.category,
        user: { id: req.user.id }
      });
      await newCategory.save();
      categoryBudget.category = newCategory;
    }

    const newCategoryBudget = await categoryBudget.save();

    reply.code(200).send({ categoryBudget: newCategoryBudget });
  });

  server.put<{
    Body: ICategoryBudget,
    Reply: ISuccessfulReply
  }>('/', {
    ...auth(server)
  }, async (req, reply) => {
    let categoryId = req.body.categoryBudget.category?.id;

    if (req.body.categoryBudget.category && !req.body.categoryBudget.category.id) {
      const category = Category.create({
        ...req.body.categoryBudget.category,
        user: { id: req.user.id }
      });
      const newCategory = await category.save();
      categoryId = newCategory.id;
    }

    if (req.body.categoryBudget.category && req.body.categoryBudget.category.id) {
        await Category.update(
        req.body.categoryBudget.category.id,
        { ...req.body.categoryBudget.category }
      );
    }

    const updateObject: DeepPartial<CategoryBudget> = req.body.categoryBudget;
    if (categoryId) {
      updateObject.category = {
        id: categoryId
      };
    }

    await CategoryBudget.update(req.body.categoryBudget.id, updateObject);

    reply.code(200).send({ message: 'Category budget updated successfully' });
  });

  server.delete<{
    Params: IIdParams,
    Reply: ISuccessfulReply
  }>('/:id', {
    ...auth(server)
  }, async (req, reply) => {
    const categoryBudget = await CategoryBudget.findOne({
      where: {
        id: req.params.id,
        category: {
          user: { id: req.user.id }
        }
      }
    });
    
    if (!categoryBudget) throw new Error('Category budget not found.');

    await Transaction.delete({ user: { id: req.user.id }, categoryBudget: { id: req.params.id } });
    await categoryBudget.remove();

    reply.code(200).send({ message: 'Category budget deleted successfully' });
  });

  done();
};
