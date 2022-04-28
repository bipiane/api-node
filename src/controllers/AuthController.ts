import * as jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';
import * as crypto from 'crypto';

import {Usuario} from '../entity/Usuario';
import {
  Body,
  Controller,
  Get,
  OperationId,
  Post,
  Put,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
import {ErrorResponse, ErrorValidacion} from './v1/utilidades/ErrorResponse';
import {UsuarioResponseData} from './v1/utilidades/UsuarioAPI';

/**
 * @example
 * {
 *   "username": "ipianetti",
 *   "password": "1234"
 * }
 */
export interface TokenRequest {
  username: string;
  password: string;
}

/**
 * @example
 * {
 *   "refreshToken": "427c5188b462e6ed9ccfa89f46e91a0"
 * }
 */
export interface RefreshTokenRequest {
  refreshToken: string;
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
  role: string;

  constructor(user: Usuario) {
    this.userId = user.id;
    this.username = user.username;
    this.role = user.role;
  }
}

export class TokenAPI {
  userId: string;
  username: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;

  constructor(payload: TokenPayload, access_token: string, refresh_token: string, expires_in: number) {
    this.userId = payload.userId;
    this.username = payload.username;
    this.role = payload.role;
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
    this.expiresIn = expires_in;
  }
}

@Tags('Auth')
@Route('/auth')
export class AuthController extends Controller {
  /**
   * @summary Obtención de Token JWT con username y password
   */
  @Post('token')
  @OperationId('token')
  @Response<ErrorResponse>('400', 'Username y password son requeridos')
  @Response<ErrorResponse>('401', 'Username o password incorrecto')
  async token(@Body() data: TokenRequest): Promise<TokenAPI> {
    const {username, password} = data;
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

    const tokenApi = AuthController.createTokens(user);

    //Send the jwt in the response
    this.setStatus(200);
    return tokenApi;
  }

  /**
   * @summary Obtención de Token JWT con refresh token
   */
  @Post('refresh')
  @OperationId('refresh')
  @Response<ErrorResponse>('400', 'refreshToken es requerido')
  @Response<ErrorResponse>('401', 'RefreshToken incorrecto o revocado')
  async refresh(@Body() data: RefreshTokenRequest): Promise<TokenAPI> {
    const refreshToken = data.refreshToken;
    if (!refreshToken) {
      throw new ErrorResponse(`refreshToken es requerido`, 400);
    }

    //Get user from database
    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail({where: {refreshToken: refreshToken}});
    } catch (error) {
      throw new ErrorResponse(`RefreshToken incorrecto o revocado`, 401);
    }
    const tokenApi = AuthController.createTokens(user);

    //Send the jwt in the response
    this.setStatus(200);
    return tokenApi;
  }

  /**
   * @summary Revoca o vence el refresh token del usuario
   */
  @Get('revoke')
  @Security('access_token')
  @OperationId('revokeToken')
  @SuccessResponse('200', 'Refresh Token revocado correctamente')
  @Response<ErrorResponse>('404', 'No se encontró usuario con ID 123')
  @Response<ErrorResponse>('409', 'Errores de validación')
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  async revoke(@Request() request: any) {
    const userJWT: TokenPayload = request.user;
    const userRepository = getRepository(Usuario);
    const usuario = await userRepository.findOne(userJWT.userId);
    if (!usuario) {
      throw new ErrorResponse(`No se encontró usuario con ID ${userJWT.userId}`, 404);
    }

    try {
      usuario.refreshToken = null;
      await userRepository.save(usuario);
    } catch (e) {
      throw new ErrorResponse('Excepción al guardar usuario.', 409, e.message);
    }

    this.setStatus(200);
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
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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

  /**
   * Permite crear un access token y refresh token para un usuario
   * @param user
   * @private
   */
  private static async createTokens(user: Usuario): Promise<TokenAPI> {
    const refreshToken = await this.getUniqueToken(user);
    if (refreshToken === null) {
      throw new ErrorResponse('Error al generar refreshToken.', 500, 'refreshToken duplicado.');
    }

    const userRepository = getRepository(Usuario);
    try {
      user.refreshToken = refreshToken;
      await userRepository.save(user);
    } catch (e) {
      throw new ErrorResponse('Excepción al guardar refreshToken.', 409, e.message);
    }

    const payload = new TokenPayload(user);
    const expiresIn = Number(process.env.JWT_EXPIRES_IN);
    const accessToken = jwt.sign(Object.assign({}, payload), process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    return new TokenAPI(payload, accessToken, user.refreshToken, expiresIn);
  }

  /**
   * Retorna un token random y único por usuario
   * @param user
   * @param retries
   * @private
   */
  private static async getUniqueToken(user: Usuario, retries = 5) {
    if (retries <= 0) {
      return null;
    }
    const refreshToken = AuthController.getRandomToken();
    const userRepository = getRepository(Usuario);

    // Buscamos otros usuarios con el mismo token
    const usuarios = (
      await userRepository.find({
        select: ['username'],
        where: {
          refreshToken: refreshToken,
        },
      })
    ).filter(u => {
      return u.username !== user.username;
    });

    // Seguimos intentando obtener un token único por usuario las veces que sea necesario
    if (usuarios.length > 0) {
      return AuthController.getUniqueToken(user, retries - 1);
    }

    return refreshToken;
  }

  /**
   * Retorna un token random
   * @param size
   * @private
   */
  private static getRandomToken(size = 40) {
    return crypto.randomBytes(size).toString('hex');
  }
}
