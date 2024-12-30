import { fastifyPlugin } from 'fastify-plugin';
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import config from '../config';
import CRMOperations from '../helpers/crm-ops';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: Function;
  }
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number,
      email: string,
    };
  }
}

const authPlugin: FastifyPluginCallback = (server, undefined, done) => {
  server.register(fastifyJwt, { secret: config.jwt.secret });

  server.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();

      CRMOperations.updateActivityDate(req.user.email);
    } catch (error) {
      reply.send(error);
    }
  });

  done();
};

export default fastifyPlugin(authPlugin);
