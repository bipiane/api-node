import {Usuario} from '../../../entity/Usuario';

export class UsuarioAPI {
  id: string;
  username: string;
  role: string;

  constructor(usuario: Usuario) {
    this.id = usuario.id;
    this.username = usuario.username;
    this.role = usuario.role;
  }
}

export interface UsuarioCreationRequest {
  username: string;
  password: string;
  role: string;
}

export interface UsuarioUpdateRequest {
  username?: string;
  role?: string;
}
