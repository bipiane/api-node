import {Response} from 'express';

export class DataResponse {
  static dataOK(res: Response, data, status = 200, userMessage: string = null, actions: string = null) {
    const resp = {
      result: 'ok',
      status: status,
      data: data,
      userMessage: userMessage,
      actions: actions,
    };
    res.status(status).send(resp);
  }

  static dataError(
    userMessage: string,
    status: number,
    developerMessage: string = null,
    validationErrors: string[] = [],
  ) {
    return {
      result: 'error',
      status: status,
      userMessage: userMessage,
      developerMessage: developerMessage,
      validationErrors: validationErrors,
    };
  }
}
