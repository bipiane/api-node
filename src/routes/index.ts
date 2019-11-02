import {Router} from 'express';
import auth from './auth';
import routesV1 from './v1';
const swaggerUi = require('swagger-ui-express');

const routes = Router();

routes.use('/auth', auth);
routes.use('/api/v1', routesV1);

// Cargamos la documentación Swagger generada
try {
  const swaggerDoc = require('./../../swagger.json');
  // Exponemos documentación SwaggerUI en la siguiente URL
  routes.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (error) {
  console.error('Error al cargar documentación Swagger: ', error);
}

export default routes;
