import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: `.env` });

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [resolve(__dirname, '**/*.entity.{ts,js}')],
  migrations: [resolve(__dirname, 'migrations/*.{ts,js}')],
  migrationsRun: true,
});
