import {Router} from 'express';
import usuarios from './usuarios';

const routes = Router();

routes.use('/usuarios', usuarios);

export default routes;
