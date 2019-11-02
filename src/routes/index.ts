import {Router} from 'express';
import auth from './auth';
import routesV1 from './v1';

const routes = Router();

routes.use('/auth', auth);
routes.use('/v1', routesV1);

export default routes;
