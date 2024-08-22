import { FastifyPluginCallback } from 'fastify';
import { User } from '../models/user';
import { IIdParams, ISuccessfulReply } from './types/generic.types';
import { IUserBody, IUserReply, ILoginReply, IChangePasswordBody } from './types/user.types';
import { idParamsSchema, successfulResponseSchema } from './schemas/generic.schemas';
import { userBodySchema, userResponseSchema, loginResponseSchema } from './schemas/user.schemas';
import { auth } from '../helpers/authenticated';

export const usersController: FastifyPluginCallback = (server, undefined, done) => {
  server.get<{
    Params: IIdParams,
    Reply: IUserReply
  }>('/:id', {
    schema: { ...idParamsSchema, ...userResponseSchema },
    ...auth(server)
  }, async (req, reply) => {
    const user = await User.findOneBy({ id: req.params.id });
    if (!user) throw new Error('User not found');
    reply.code(200).send({ user });
  });

  server.post<{
    Body: IUserBody,
    Reply: IUserReply
  }>('/', { schema: { ...userBodySchema, ...userResponseSchema } }, async (req, reply) => {
    const user = User.create<User>(req.body.user);
    const newUser = await user.save();
    reply.code(200).send({ user: { ...newUser } });
  });

  server.post<{
    Body: IUserBody,
    Reply: ILoginReply
  }>('/login', { schema: { ...userBodySchema, ...loginResponseSchema } }, async (req, reply) => {
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
    schema: { ...userBodySchema, ...successfulResponseSchema },
    ...auth(server)
  }, async (req, reply) => {
    await User.update(req.user.id, req.body.user);
    reply.code(200).send({ message: 'User updated succesfully' });
  });

  server.delete<{
    Params: IIdParams,
    Reply: ISuccessfulReply
  }>('/:id', {
    schema: { ...idParamsSchema, ...successfulResponseSchema },
    ...auth(server)
  }, async (req, reply) => {
    await User.delete(req.params.id);
    reply.code(200).send({ message: 'User deleted succesfully' });
  });

  done();
};
