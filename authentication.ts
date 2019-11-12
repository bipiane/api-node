import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import config from './src/config/config';
import {getRepository} from 'typeorm';
import {Usuario} from './src/entity/Usuario';

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === 'access_token') {
    const token = request.headers.authorization;

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('Solicitud sin token'));
      }
      jwt.verify(token, config.jwtSecret, async function(err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          // Validamos los roles del usuario
          const userRepository = getRepository(Usuario);
          let user: Usuario = null;
          try {
            user = await userRepository.findOneOrFail(decoded.userId);
          } catch (e) {
            reject(new Error('Error al validar roles. Usuario no encontrado.'));
          }

          for (let scope of scopes) {
            if (user && user.role !== scope) {
              reject(new Error('El usuario no posee los roles requeridos.'));
            }
          }

          resolve(decoded);
        }
      });
    });
  }
}
