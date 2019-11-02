import {Router} from 'express';
import UsuarioController from '../../controllers/v1/UsuarioController';
import {checkJwt} from '../../middlewares/checkJwt';
import {checkRole} from '../../middlewares/checkRole';

const router = Router();

//Get all users
router.get('/', /*[checkJwt, checkRole(["ADMIN"])],*/ UsuarioController.listAll);

// Get one user
router.get('/:id', /*[checkJwt, checkRole(['ADMIN'])],*/ UsuarioController.getOneById);

//Create a new user
router.post('/', [checkJwt, checkRole(['ADMIN'])], UsuarioController.newUser);

//Edit one user
router.patch('/:id', [checkJwt, checkRole(['ADMIN'])], UsuarioController.editUser);

//Delete one user
router.delete('/:id', [checkJwt, checkRole(['ADMIN'])], UsuarioController.deleteUser);

export default router;