import {Usuario} from '../../../entity/Usuario';
import {DataOk} from './DataOk';

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

export class UsuarioResponseData extends DataOk {
  data: UsuarioAPI;

  constructor(usuario: Usuario, status = 200, userMessage: string = null, actions: string = null) {
    super(status, userMessage, actions);
    this.data = new UsuarioAPI(usuario);
  }
}

export class UsuarioResponseLista extends DataOk {
  data: UsuarioAPI[];

  constructor(usuarios: Usuario[], status = 200, userMessage: string = null, actions: string = null) {
    super(status, userMessage, actions);
    this.data = usuarios.map(u => {
      return new UsuarioAPI(u);
    });
  }
}
