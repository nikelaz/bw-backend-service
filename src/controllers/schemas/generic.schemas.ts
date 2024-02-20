import { FastifySchema } from 'fastify';

export const idParamsSchema: FastifySchema = {
  params: {
    id: { type: 'number' }
  }
};

export const successfulResponseSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};
