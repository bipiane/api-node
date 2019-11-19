import {expect} from 'chai';
import {DataOk} from '../../../src/controllers/v1/utilidades/DataOk';

describe('DataOk/result', () => {
  it('El `result` de las respuestas OK debería ser `ok`', () => {
    const sut = new DataOk(201);
    expect(sut.result).to.equal('ok', 'error');
  });
  it('Mensaje de usuario y acciones', () => {
    const sut = new DataOk(200, 'Consulta exitosa', 'index_usuarios');
    expect(sut.result).to.equal('ok', '-');
    expect(sut.userMessage).to.equal('Consulta exitosa', '-');
    expect(sut.actions).to.equal('index_usuarios', '-');
  });
});
