import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const auth = (server: FastifyInstance) => ({
  onRequest: (req: FastifyRequest, reply: FastifyReply) => server.authenticate(req, reply)
});