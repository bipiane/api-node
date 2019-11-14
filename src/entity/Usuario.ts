import {Entity, Column, Unique, CreateDateColumn, UpdateDateColumn, ObjectIdColumn} from 'typeorm';
import {IsNotEmpty, MinLength, MaxLength} from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class Usuario {
  @ObjectIdColumn()
  id: string;

  @Column()
  @MinLength(4, {
    message: 'Username muy corto. El tamaño mínimo de username es $constraint1 caracteres.',
    context: {code: 'usuario.minlength.username'},
  })
  @MaxLength(20, {
    message: 'Username muy largo. El tamaño máximo de username es $constraint1 caracteres.',
    context: {code: 'usuario.maxlength.username'},
  })
  username: string;

  @Column()
  @MinLength(4, {
    message: 'Password muy corta. El tamaño mínimo de password es $constraint1 caracteres.',
    context: {code: 'usuario.minlength.password'},
  })
  @MaxLength(100, {
    message: 'Password muy larga. El tamaño máximo de password es $constraint1 caracteres.',
    context: {code: 'usuario.maxlength.password'},
  })
  password: string;

  @Column()
  @IsNotEmpty({
    message: 'El rol del usuario es obligatorio.',
    context: {code: 'usuario.isnotempty.role'},
  })
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
