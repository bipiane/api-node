import {MongoConnectionOptions} from 'typeorm/driver/mongodb/MongoConnectionOptions';

// Cargamos tanto las variables del archivo `.envrc` para desarrollo local
// como las variables de `docker-compose.yml` para docker
let {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD} = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error("Variables de entorno no encontradas. Verifique archivo '.envrc'.");
}

const conn: MongoConnectionOptions = {
  type: 'mongodb',
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  synchronize: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  logging: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

module.exports = conn;
