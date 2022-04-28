import {expect} from 'chai';
import {Usuario} from '../../src/entity/Usuario';

const sut = new Usuario();
describe('usuario/password', () => {
  it('El hash del password debe ser string', () => {
    sut.password = 'asdf';
    expect(sut.hashPassword()).to.be.a('string');
  });
  it('Password correcto', () => {
    const clave = 'asdf';
    sut.password = '$2a$08$d728wuZ7ttMfDkl2I.kjYOetHMgXTYpbjZY6AyrUTJF5gpKdAmgHq';
    expect(sut.checkIfUnencryptedPasswordIsValid(clave)).to.equal(true, '-');
  });
  it('Password incorrecto', () => {
    const clave = 'asdf';
    sut.password = clave;
    sut.hashPassword();
    expect(sut.checkIfUnencryptedPasswordIsValid(clave)).to.equal(true, '-');
  });
});
