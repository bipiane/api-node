import {expect} from 'chai';
import {ErrorResponse, ErrorValidacion} from '../../../src/controllers/v1/utilidades/ErrorResponse';
import {ValidationError} from 'class-validator';

describe('ErrorResponse', () => {
  it('El `result` de las respuestas Error debería ser `error`', () => {
    const sut = new ErrorResponse('Error al guardar', 500);
    expect(sut.result).to.equal('error', '-');
  });

  it('La propiedad del error de validación es incorrecta', () => {
    const ve = new ValidationError();
    ve.property = 'username';
    const sut = new ErrorValidacion(ve);
    expect(sut.propertyPath).to.equal('username', '-');
  });

  it('El código del error de validación es incorrecto', () => {
    const ve = new ValidationError();
    ve.contexts = {minLength: {code: 'usuario.minlength.username'}};
    const sut = new ErrorValidacion(ve);
    expect(sut.code).to.equal('usuario.minlength.username', '-');
  });

  it('El código del error de validación debe ser nulo', () => {
    const ve = new ValidationError();
    const sut = new ErrorValidacion(ve);
    expect(sut.code).to.equal(null, '-');
  });

  it('El código del error de validación debe ser nulo', () => {
    const ve = new ValidationError();
    ve.constraints = {
      minLength: 'El tamaño mínimo de username es...',
    };

    const sut = new ErrorValidacion(ve);
    expect(sut.message).to.equal('El tamaño mínimo de username es...', '-');
  });
});
