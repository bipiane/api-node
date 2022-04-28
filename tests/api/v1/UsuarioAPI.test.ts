import {expect} from 'chai';
import {
  UsuarioAPI,
  UsuarioAPIPaginacion,
  UsuarioResponseData,
  UsuarioResponsePaginacion,
} from '../../../src/controllers/v1/utilidades/UsuarioAPI';
import {Usuario} from '../../../src/entity/Usuario';

describe('UsuarioAPI', () => {
  it('Id de usuario correcto', () => {
    const user = new Usuario();
    user.id = '607080209aa0097d48f1536b';
    const sut = new UsuarioAPI(user);
    expect(sut.id).to.equal('607080209aa0097d48f1536b', '-');
  });
  it('Username de usuario correcto', () => {
    const user = new Usuario();
    user.username = 'satoshi';
    const sut = new UsuarioAPI(user);
    expect(sut.username).to.equal('satoshi', '-');
  });
  it('Rol de usuario correcto', () => {
    const user = new Usuario();
    user.role = 'SUPER_ADMIN';
    const sut = new UsuarioAPI(user);
    expect(sut.role).to.equal('SUPER_ADMIN', '-');
  });
});

describe('UsuarioAPI/UsuarioAPIPaginacion', () => {
  it('Metadata de usuarios paginados correcta', () => {
    const usuarios = [new Usuario(), new Usuario()];
    const sut = new UsuarioAPIPaginacion(usuarios, 1, 100, 30);
    expect(sut.metadata.offset).to.equal(1, '-');
    expect(sut.metadata.limit).to.equal(100, '-');
    expect(sut.metadata.count).to.equal(30, '-');
  });
  it('Resultados de usuarios paginados correcta', () => {
    const user1 = new Usuario();
    user1.id = 'id#1';
    user1.username = 'User@1';
    const user2 = new Usuario();
    user2.id = 'id#2';
    user2.username = 'User@2';
    const usuarios = [user1, user2];
    const sut = new UsuarioAPIPaginacion(usuarios, 3, 50, 40);
    expect(sut.results.length).to.equal(2, '-');
    expect(sut.results.map(u => u.id).join(',')).to.equal('id#1,id#2', '-');
    expect(sut.results.map(u => u.username).join(',')).to.equal('User@1,User@2', '-');
  });
});

describe('UsuarioAPI/UsuarioResponseData', () => {
  it('UsuarioResponseData correcta', () => {
    const user = new Usuario();
    user.username = 'user_1';
    const sut = new UsuarioResponseData(user);
    expect(sut.result).to.equal('ok', '-');
    expect(sut.status).to.equal(200, '-');
    expect(sut.data.username).to.equal('user_1', '-');
  });
});

describe('UsuarioAPI/UsuarioResponsePaginacion', () => {
  it('UsuarioResponsePaginacion correcta', () => {
    const user1 = new Usuario();
    user1.username = 'User@1';
    const user2 = new Usuario();
    user2.username = 'User@2';
    const usuarios = [user1, user2];
    const sut = new UsuarioResponsePaginacion(usuarios, 1, 2, 3);
    expect(sut.result).to.equal('ok', '-');
    expect(sut.status).to.equal(200, '-');
    expect(sut.data.metadata.offset).to.equal(1, '-');
    expect(sut.data.metadata.limit).to.equal(2, '-');
    expect(sut.data.metadata.count).to.equal(3, '-');
    expect(sut.data.results.map(u => u.username).join(',')).to.equal('User@1,User@2', '-');
  });
});
