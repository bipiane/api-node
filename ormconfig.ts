const {DB_HOST, DB_PORT, DB_NAME} = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME) {
  throw new Error("Variables de entorno no encontradas. Verifique archivo '.env'.");
}

module.exports = {
  type: 'mongodb',
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  synchronize: true,
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
