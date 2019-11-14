import 'reflect-metadata';
import chalk from 'chalk';
import {createConnection} from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import {RegisterRoutes} from './router/routes';
const swaggerUi = require('swagger-ui-express');
import * as errorHandler from 'api-error-handler';

// Obtenemos variables de .env
const port = process.env.APP_PORT || 3000;

// Creamos conexión y luego iniciamos express
createConnection()
  .then(async () => {
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
      const swaggerDoc = require('../apiDoc/swagger.json');
      // Exponemos documentación SwaggerUI en la siguiente URL
      app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    } catch (error) {
      console.error('Error al cargar documentación Swagger: ', error);
    }

    app.listen(port, () => {
      console.log(chalk.green(`🚀 Server started: http://localhost:${port}/doc`));
    });
  })
  .catch(error => {
    console.log('🐛 Server Error!');
    console.error(error);
  });
