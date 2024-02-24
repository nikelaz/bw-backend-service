export default {
  port: parseInt(process.env.PORT),
  apiPrefix: '/api/v1',
  jwt: {
    secret: process.env.JWT_SECRET
  },
  postgres: {
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB,
  }
};