import { Options } from '@mikro-orm/core';

const config: Options = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  seeder: {
    path: './dist/seeders',
    pathTs: './src/seeders',
  },
  dbName: 'node_gmp',
  user: 'node_gmp',
  password: 'password123',
  host: 'localhost',
  type: 'postgresql',
};

export default config;
