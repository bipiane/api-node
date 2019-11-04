export class ErrorResponse extends Error {
  result: 'error';
  status: number;
  userMessage: string;
  developerMessage: string;
  validationErrors: string[];

  constructor(userMessage: string, status: number, developerMessage: string = null, validationErrors: string[] = []) {
    super();
    // Ocultamos stack trace
    Error.captureStackTrace(this, this.constructor);
    this.result = 'error';
    this.status = status;
    this.userMessage = userMessage;
    this.developerMessage = developerMessage;
    this.validationErrors = validationErrors;
  }
}
