import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Task } from '../entities/Task';

const dbPassword = process.env.DB_PASSWORD || '';
console.log('DB password present?', dbPassword ? 'yes' : 'no');

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: dbPassword,
  database: process.env.DB_NAME || 'task_manager',
  entities: [User, Task],
  migrations: ['dist/migrations/**/*.js'],
  synchronize: false,
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development',
  subscribers: [],
  extra: {
    supportBigNumbers: true,
    bigNumberStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
});
