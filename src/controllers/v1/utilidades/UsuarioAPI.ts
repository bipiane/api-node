import {Usuario} from '../../../entity/Usuario';

export class UsuarioAPI {
  id: number;
  username: string;
  role: string;

  constructor(usuario: Usuario) {
    this.id = usuario.id;
    this.username = usuario.username;
    this.role = usuario.role;
  }
}
