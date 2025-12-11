import path from 'path';
import { parse } from 'pg-connection-string';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  // Logic to handle Render's Postgres connection
  if (client === 'postgres') {
    const config = parse(env('DATABASE_URL'));
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: {
            rejectUnauthorized: false, // Critical for Render
          },
        },
        debug: false,
      },
    };
  }

  // Fallback for Localhost (SQLite)
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};