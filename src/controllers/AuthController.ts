import * as jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {Usuario} from '../entity/Usuario';
import {Body, Controller, OperationId, Post, Put, Request, Response, Route, Security, Tags} from 'tsoa';
import {ErrorResponse, ErrorValidacion} from './v1/utilidades/ErrorResponse';
import {UsuarioResponseData} from './v1/utilidades/UsuarioAPI';

/**
 * @example
 * {
 *   "username": "ipianetti",
 *   "password": "1234"
 * }
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * @example
 * {
 *   "oldPassword": "asdf",
 *   "newPassword": "1234"
 * }
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export class TokenPayload {
  userId: string;
  username: string;

  constructor(user: Usuario) {
    this.userId = user.id;
    this.username = user.username;
  }
}

export class TokenAPI {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

@Tags('Auth')
@Route('/')
export class AuthController extends Controller {
  /**
   * @summary Obtención de Token JWT
   */
  @Post('login')
  @OperationId('login')
  @Response<ErrorResponse>('400', 'Username y password son requeridos')
  @Response<ErrorResponse>('401', 'Username o password incorrecto')
  async login(@Body() data: LoginRequest): Promise<TokenAPI> {
    let {username, password} = data;
    if (!(username && password)) {
      throw new ErrorResponse(`Username y password son requeridos`, 400);
    }

    //Get user from database
    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail({where: {username}});
    } catch (error) {
      throw new ErrorResponse(`Username o password incorrecto`, 401);
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new ErrorResponse(`Username o password incorrecto`, 401);
    }

    //Sing JWT, valid for 1 hour
    const payload = new TokenPayload(user);
    const token = jwt.sign(Object.assign({}, payload), process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    //Send the jwt in the response
    this.setStatus(200);
    return new TokenAPI(token);
  }

  /**
   * @summary Modificar clave
   */
  @Put('changePassword')
  @Security('access_token')
  @OperationId('changePassword')
  @Response<ErrorResponse>('400', 'La clave nueva y actual clave son requeridas')
  @Response<ErrorResponse>('401', 'La clave actual es incorrecta')
  @Response<ErrorResponse>('409', 'Errores de validación')
  async changePassword(@Request() request: any, @Body() data: ChangePasswordRequest): Promise<UsuarioResponseData> {
    //Get ID from JWT
    const userJWT: TokenPayload = request.user;

    const {oldPassword, newPassword} = data;
    if (!(oldPassword && newPassword)) {
      throw new ErrorResponse(`La clave nueva y actual clave son requeridas`, 400);
    }

    //Get user from the database
    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail(userJWT.userId);
    } catch (id) {
      throw new ErrorResponse(`Usuario incorrecto`, 401);
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      throw new ErrorResponse(`La clave actual es incorrecta`, 401);
    }

    //Validate de model (password lenght)
    user.password = newPassword;
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

    //Hash the new password and save
    user.hashPassword();
    await userRepository.save(user);

    this.setStatus(200);
    return new UsuarioResponseData(user);
  }
}
