import {Body, Controller, Delete, Get, OperationId, Post, Put, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {Usuario} from '../../entity/Usuario';
import {
  UsuarioCreationRequest,
  UsuarioUpdateRequest,
  UsuarioResponseData,
  UsuarioResponseLista,
} from './utilidades/UsuarioAPI';
import {ErrorResponse} from './utilidades/ErrorResponse';

/**
 * @TODO Implementar midleware de seguridad: [checkJwt, checkRole(['ADMIN'])]
 */
@Tags('Usuario')
@Route('api/v1/usuarios')
export class UsuarioController extends Controller {
  /**
   * @summary Obtiene una lista de usuarios
   */
  @Get()
  @OperationId('findAllUsuarios')
  async index(): Promise<UsuarioResponseLista> {
    const userRepository = getRepository(Usuario);
    const lista = await userRepository.find();

    return new UsuarioResponseLista(lista);
  }

  /**
   * @summary Obtiene un usuario por ID
   * @param id
   */
  @Get('{id}')
  @Response<ErrorResponse>('404', 'No se encontró usuario con ID 123')
  @OperationId('findUsuario')
  async show(id: string): Promise<UsuarioResponseData> {
    const userRepository = getRepository(Usuario);
    const usuario = await userRepository.findOne(id);

    if (!usuario) {
      this.setStatus(404);
      throw new ErrorResponse(`No se encontró usuario con ID ${id}`, 404);
    }

    return new UsuarioResponseData(usuario);
  }

  /**
   * @summary Permite crear un usuario
   * @param data
   */
  @Post()
  @OperationId('saveUsuario')
  @SuccessResponse('201', 'Usuario creado correctamente')
  async save(@Body() data: UsuarioCreationRequest): Promise<UsuarioResponseData> {
    let {username, password, role} = data;
    let user = new Usuario();
    user.username = username;
    user.password = password;
    user.role = role;

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      // res.status(400).send(errors);
      this.setStatus(400);
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(Usuario);
    try {
      await userRepository.save(user);
    } catch (e) {
      // res.status(409).send('username already in use');
      this.setStatus(409);
      return;
    }

    this.setStatus(201);
    return new UsuarioResponseData(user, 201, 'Usuario creado correctamente');
  }

  /**
   * @summary Permite actualizar un usuario por ID
   * @param id
   * @param data
   */
  @Put('{id}')
  @OperationId('updateUsuario')
  async update(id: string, @Body() data: UsuarioUpdateRequest): Promise<UsuarioResponseData> {
    const {username, role} = data;

    //Try to find user on database
    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      console.log('Usuario no encontrado: ', error);
      //If not found, send a 404 response
      // res.status(404).send('User not found');
      this.setStatus(404);
      return;
    }

    //Validate the new values on model
    user.username = username ? username : user.username;
    user.role = role ? role : user.role;
    const errors = await validate(user);
    if (errors.length > 0) {
      console.log('Error validación: ', errors);
      // res.status(400).send(errors);
      this.setStatus(400);
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      user = await userRepository.save(user);
    } catch (e) {
      console.log('Excepción al guardar: ', e);
      // res.status(409).send('username already in use');
      this.setStatus(409);
      return;
    }
    //After all send a 204 (no content, but accepted) response
    // res.status(204).send();
    return new UsuarioResponseData(user, 200, 'Usuario actualizado correctamente');
  }

  /**
   * @summary Permite borrar un usuario por ID
   * @param id
   */
  @Delete('{id}')
  @OperationId('deleteUsuario')
  async delete(id: string): Promise<true> {
    const userRepository = getRepository(Usuario);
    try {
      await userRepository.findOneOrFail(id);
    } catch (error) {
      // res.status(404).send('User not found');
      this.setStatus(404);
      return;
    }
    await userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    // res.status(204).send();
    this.setStatus(204);
    return true;
  }
}
