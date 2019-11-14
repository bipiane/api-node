import {ValidationError} from 'class-validator';

export class ErrorValidacion {
  propertyPath: string;
  code: string;
  message: string;

  constructor(validation: ValidationError) {
    this.propertyPath = validation.property;
    this.code = null;
    this.message = null;

    // Cargamos el código de error del contexto de constraint
    if (validation.contexts) {
      const contextos = Object.keys(validation.contexts);
      const codigo = validation.contexts[contextos[0]];
      if (codigo && codigo.code) {
        this.code = codigo.code;
      }
    }

    // Obtenemos el mensaje de validación
    const keys = Object.keys(validation.constraints);
    if (keys.length > 0) {
      this.message = validation.constraints[keys[0]];
    }
  }
}

export class ErrorResponse {
  result: 'error';
  status: number;
  userMessage: string;
  developerMessage: string;
  validationErrors: ErrorValidacion[];

  /**
   * @param userMessage
   * @param status
   * @param developerMessage
   * @param validationErrors
   */
  constructor(
    userMessage: string,
    status: number,
    developerMessage: string = null,
    validationErrors: ErrorValidacion[] = [],
  ) {
    this.result = 'error';
    this.status = status;
    this.userMessage = userMessage;
    this.developerMessage = developerMessage;
    this.validationErrors = validationErrors;
  }
}
