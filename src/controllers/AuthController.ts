import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {Usuario} from '../entity/Usuario';
import config from '../config/config';
import {Body, Controller, OperationId, Post, Route, Tags} from 'tsoa';

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

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const {oldPassword, newPassword} = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(Usuario);
    let user: Usuario;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
