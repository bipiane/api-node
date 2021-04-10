import {MongoConnectionOptions} from 'typeorm/driver/mongodb/MongoConnectionOptions';

// Cargamos tanto las variables del archivo `.env` para desarrollo local
// como las variables de `docker-compose.yml` para docker
let {DB_URL, DB_AUTH_SOURCE} = process.env;

if (!DB_URL || !DB_AUTH_SOURCE) {
  throw new Error("Variables de entorno no encontradas. Verifique archivo '.env'.");
}

const conn: MongoConnectionOptions = {
  type: 'mongodb',
  url: DB_URL,
  synchronize: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  logging: true,
  entities: ['src/entity/*.ts', './build/src/entity/*.js'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
  extra: {
    authSource: DB_AUTH_SOURCE,
  },
};

module.exports = conn;
