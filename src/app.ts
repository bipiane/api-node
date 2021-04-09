import 'reflect-metadata';
import chalk from 'chalk';
import {createConnection} from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import {RegisterRoutes} from './router/routes';
import {ErrorResponse} from './controllers/v1/utilidades/ErrorResponse';
const swaggerUi = require('swagger-ui-express');

// Obtenemos variables de .env
const port = process.env.PORT || 3000;

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

    // Interceptamos y formateamos los errores y excepciones
    app.use((err, _req: express.Request, res: express.Response, next: express.NextFunction) => {
      const status = err.status || 500;

      let body = err;
      // Si el error no es del tipo ErrorResponse lo formateamos
      if (!(err instanceof ErrorResponse) && (!err.result || !err.userMessage)) {
        if (status === 500) {
          body = new ErrorResponse('Se ha producido un error al procesar la solicitud.', status, err.message);
        } else {
          body = new ErrorResponse(err.message, status);
        }
      }
      res.status(status).json(body);
      next();
    });

    // Cargamos la documentación Swagger generada
    try {
      const swaggerDoc = require('../apiDoc/swagger.json');
      // Exponemos documentación SwaggerUI en la siguiente URL
      app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    } catch (error) {
      console.error('Error al cargar documentación Swagger: ', error);
    }

    // Redirect del home a la documentación
    app.get('/', function(req, res) {
      res.redirect('/doc');
    });

    app.listen(Number(port), '0.0.0.0', () => {
      console.log(chalk.green(`🚀 Server started: http://localhost:${port}/doc`));
    });
  })
  .catch(error => {
    console.log('🐛 Server Error!');
    console.error(error);
  });
