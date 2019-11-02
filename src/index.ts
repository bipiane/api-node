import 'reflect-metadata';
import {createConnection} from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import {RegisterRoutes} from './router/routes';
const swaggerUi = require('swagger-ui-express');

const port = process.env.PORT || 3000;

//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // Cargamos todas las rutas generadas por TSOA
    RegisterRoutes(app);

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
  .catch(error => console.log(error));
