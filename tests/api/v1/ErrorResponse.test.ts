import {expect} from 'chai';
import {ErrorResponse} from '../../../src/controllers/v1/utilidades/ErrorResponse';

describe('ErrorResponse', () => {
  it('El `result` de las respuestas Error debería ser `error`', () => {
    const sut = new ErrorResponse('Error al guardar', 500);
    expect(sut.result).to.equal('error', '-');
  });
});
