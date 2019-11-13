import * as jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {Usuario} from '../entity/Usuario';
import config from '../config/config';
import {Body, Controller, OperationId, Post, Put, Request, Route, Security, Tags} from 'tsoa';

/**
 * @example
 * {
 *   "username": "ipianetti",
 *   "password": "123"
 * }
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * @example
 * {
 *   "newPassword": "123",
 *   "oldPassword": "asdf"
 * }
 */
export interface ChangePasswordRequest {
  newPassword: string;
  oldPassword: string;
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
  async login(@Body() data: LoginRequest): Promise<TokenAPI> {
    let {username, password} = data;
    if (!(username && password)) {
      this.setStatus(400);
    }

    //Get user from database
    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail({where: {username}});
    } catch (error) {
      this.setStatus(401);
      return;
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      this.setStatus(401);
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {
      expiresIn: '1h',
    });

    //Send the jwt in the response
    return new TokenAPI(token);
  }

  /**
   * @summary Modificar clave
   */
  @Put('changePassword')
  @Security('access_token')
  @OperationId('changePassword')
  async changePassword(@Request() request: any, @Body() data: ChangePasswordRequest) {
    //Get ID from JWT
    const id = request.user.userId;

    if (!(data.oldPassword && data.newPassword)) {
      this.setStatus(400);
    }

    //Get user from the database
    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      this.setStatus(401);
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(data.oldPassword)) {
      this.setStatus(401);
      return;
    }

    //Validate de model (password lenght)
    user.password = data.newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      this.setStatus(400);
      return;
    }

    //Hash the new password and save
    user.hashPassword();
    await userRepository.save(user);

    this.setStatus(204);
  }
}
