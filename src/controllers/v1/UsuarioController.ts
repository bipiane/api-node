import {
  Body,
  Controller,
  Delete,
  Get,
  OperationId,
  Post,
  Put,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {Usuario} from '../../entity/Usuario';
import {
  UsuarioCreationRequest,
  UsuarioUpdateRequest,
  UsuarioResponseData,
  UsuarioResponseLista,
} from './utilidades/UsuarioAPI';
import {ErrorResponse, ErrorValidacion} from './utilidades/ErrorResponse';

@Tags('Usuario')
@Route('api/v1/usuarios')
export class UsuarioController extends Controller {
  /**
   * @summary Obtiene una lista de usuarios
   */
  @Get()
  @Security('access_token', ['SUPER_ADMIN'])
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
  @Security('access_token', ['SUPER_ADMIN'])
  @OperationId('findUsuario')
  @Response<ErrorResponse>('404', 'No se encontró usuario con ID 123')
  async show(id: string): Promise<UsuarioResponseData> {
    const userRepository = getRepository(Usuario);
    const usuario = await userRepository.findOne(id);

    if (!usuario) {
      throw new ErrorResponse(`No se encontró usuario con ID ${id}`, 404);
    }

    return new UsuarioResponseData(usuario);
  }

  /**
   * @summary Permite crear un usuario
   * @param data
   */
  @Post()
  @Security('access_token', ['SUPER_ADMIN'])
  @OperationId('saveUsuario')
  @SuccessResponse('201', 'Usuario creado correctamente')
  @Response<ErrorResponse>('409', 'Errores de validación')
  async save(@Body() data: UsuarioCreationRequest): Promise<UsuarioResponseData> {
    let {username, password, role} = data;
    let user = new Usuario();
    user.username = username;
    user.password = password;
    user.role = role;

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      const validationErrors = errors.map(e => {
        return new ErrorValidacion(e);
      });
      throw new ErrorResponse(
        'Por favor revise la información ingresada.',
        409,
        'Errores de validación',
        validationErrors,
      );
    }

    user.hashPassword();

    const userRepository = getRepository(Usuario);
    try {
      await userRepository.save(user);
    } catch (e) {
      throw new ErrorResponse('Excepción al guardar usuario.', 409, e.message);
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
  @Security('access_token', ['SUPER_ADMIN'])
  @OperationId('updateUsuario')
  @SuccessResponse('200', 'Usuario actualizado correctamente')
  @Response<ErrorResponse>('404', 'No se encontró usuario con ID 123')
  @Response<ErrorResponse>('409', 'Errores de validación')
  async update(id: string, @Body() data: UsuarioUpdateRequest): Promise<UsuarioResponseData> {
    const {username, role} = data;

    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      throw new ErrorResponse(`No se encontró usuario con ID ${id}`, 404);
    }

    user.username = username ? username : user.username;
    user.role = role ? role : user.role;
    const errors = await validate(user);
    if (errors.length > 0) {
      const validationErrors = errors.map(e => {
        return new ErrorValidacion(e);
      });
      throw new ErrorResponse(
        'Por favor revise la información ingresada.',
        409,
        'Errores de validación',
        validationErrors,
      );
    }

    try {
      user = await userRepository.save(user);
    } catch (e) {
      throw new ErrorResponse('Excepción al guardar usuario.', 409, e.message);
    }

    this.setStatus(200);
    return new UsuarioResponseData(user, 200, 'Usuario actualizado correctamente');
  }

  /**
   * @summary Permite borrar un usuario por ID
   * @param id
   */
  @Delete('{id}')
  @Security('access_token', ['SUPER_ADMIN'])
  @OperationId('deleteUsuario')
  @SuccessResponse('200', 'Usuario eliminado correctamente')
  @Response<ErrorResponse>('404', 'No se encontró usuario con ID 123')
  async delete(id: string): Promise<UsuarioResponseData> {
    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      throw new ErrorResponse(`No se encontró usuario con ID ${id}`, 404);
    }
    await userRepository.delete(id);

    this.setStatus(200);
    return new UsuarioResponseData(user, 200, 'Usuario eliminado correctamente');
  }
}
