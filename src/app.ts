import 'reflect-metadata';
import {createConnection, getConnectionOptions} from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import {RegisterRoutes} from './router/routes';
import {MongoConnectionOptions} from 'typeorm/driver/mongodb/MongoConnectionOptions';
const swaggerUi = require('swagger-ui-express');
import * as errorHandler from 'api-error-handler';

// Obtenemos variables de .env
const port = process.env.APP_PORT || 3000;
const {DB_HOST, DB_PORT, DB_NAME} = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME) {
  throw new Error("Variables de entorno no encontradas. Verifique archivo '.env'.");
}

// read connection options from ormconfig file (or ENV variables)
// Leemos conexión de `ormconfig.json` y completamos datos
getConnectionOptions().then((connectionOptions: MongoConnectionOptions) => {
  // Completamos configuración según environment
  Object.assign(connectionOptions, {host: DB_HOST, port: DB_PORT, database: DB_NAME});

  // Creamos conexión y luego iniciamos express
  createConnection(connectionOptions)
    .then(async connection => {
      // Creamos instancia express
      const app = express();

      // Midlewares
      app.use(cors());
      app.use(helmet());
      app.use(bodyParser.json());

      // Cargamos todas las rutas generadas por TSOA
      RegisterRoutes(app);

      // Tratamos los errores de API
      app.use(errorHandler());

      // Cargamos la documentación Swagger generada
      try {
        const swaggerDoc = require('../swagger.json');
        // Exponemos documentación SwaggerUI en la siguiente URL
        app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
      } catch (error) {
        console.error('Error al cargar documentación Swagger: ', error);
      }

      app.listen(port, () => {
        console.log(`🚀 Server started: http://localhost:${port}/doc`);
      });
    })
    .catch(error => {
      console.log('🐛 Server Error!');
      console.error(error);
    });
});
