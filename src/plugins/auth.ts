import { fastifyPlugin } from 'fastify-plugin';
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import config from '../config';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: Function;
  }
};

const authPlugin: FastifyPluginCallback = (server, undefined, done) => {
  server.register(fastifyJwt, { secret: config.jwt.secret });

  server.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch (error) {
      reply.send(error);
    }
  });

  done();
};

export default fastifyPlugin(authPlugin);
