/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute} from 'tsoa';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {AuthController} from './../controllers/AuthController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {UsuarioController} from './../controllers/v1/UsuarioController';
import {expressAuthentication} from './../../authentication';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  TokenAPI: {
    dataType: 'refObject',
    properties: {
      token: {dataType: 'string', required: true},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  LoginRequest: {
    dataType: 'refObject',
    properties: {
      username: {dataType: 'string', required: true},
      password: {dataType: 'string', required: true},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ChangePasswordRequest: {
    dataType: 'refObject',
    properties: {
      newPassword: {dataType: 'string', required: true},
      oldPassword: {dataType: 'string', required: true},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UsuarioAPI: {
    dataType: 'refObject',
    properties: {
      id: {dataType: 'string', required: true},
      username: {dataType: 'string', required: true},
      role: {dataType: 'string', required: true},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UsuarioResponseLista: {
    dataType: 'refObject',
    properties: {
      result: {dataType: 'string', default: 'ok'},
      status: {dataType: 'double', default: 200},
      data: {dataType: 'array', array: {ref: 'UsuarioAPI'}, required: true},
      userMessage: {dataType: 'string', required: true},
      actions: {dataType: 'string', required: true},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UsuarioResponseData: {
    dataType: 'refObject',
    properties: {
      result: {dataType: 'string', default: 'ok'},
      status: {dataType: 'double', default: 200},
      data: {ref: 'UsuarioAPI', required: true},
      userMessage: {dataType: 'string', required: true},
      actions: {dataType: 'string', required: true},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ErrorResponse: {
    dataType: 'refObject',
    properties: {
      stack: {dataType: 'string'},
      result: {dataType: 'enum', enums: ['error'], required: true},
      status: {dataType: 'double', required: true},
      userMessage: {dataType: 'string', required: true},
      developerMessage: {dataType: 'string', required: true},
      validationErrors: {dataType: 'array', array: {dataType: 'string'}, required: true},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UsuarioCreationRequest: {
    dataType: 'refObject',
    properties: {
      username: {dataType: 'string', required: true},
      password: {dataType: 'string', required: true},
      role: {dataType: 'string', required: true},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UsuarioUpdateRequest: {
    dataType: 'refObject',
    properties: {
      username: {dataType: 'string'},
      role: {dataType: 'string'},
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################
  app.post('/login', function(request: any, response: any, next: any) {
    const args = {
      data: {in: 'body', name: 'data', required: true, ref: 'LoginRequest'},
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    let validatedArgs: any[] = [];
    try {
      validatedArgs = getValidatedArgs(args, request);
    } catch (err) {
      return next(err);
    }

    const controller = new AuthController();

    const promise = controller.login.apply(controller, validatedArgs as any);
    promiseHandler(controller, promise, response, next);
  });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put('/changePassword', authenticateMiddleware([{access_token: []}]), function(
    request: any,
    response: any,
    next: any,
  ) {
    const args = {
      request: {in: 'request', name: 'request', required: true, dataType: 'object'},
      data: {in: 'body', name: 'data', required: true, ref: 'ChangePasswordRequest'},
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    let validatedArgs: any[] = [];
    try {
      validatedArgs = getValidatedArgs(args, request);
    } catch (err) {
      return next(err);
    }

    const controller = new AuthController();

    const promise = controller.changePassword.apply(controller, validatedArgs as any);
    promiseHandler(controller, promise, response, next);
  });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/api/v1/usuarios', authenticateMiddleware([{access_token: ['SUPER_ADMIN']}]), function(
    request: any,
    response: any,
    next: any,
  ) {
    const args = {};

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    let validatedArgs: any[] = [];
    try {
      validatedArgs = getValidatedArgs(args, request);
    } catch (err) {
      return next(err);
    }

    const controller = new UsuarioController();

    const promise = controller.index.apply(controller, validatedArgs as any);
    promiseHandler(controller, promise, response, next);
  });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get('/api/v1/usuarios/:id', authenticateMiddleware([{access_token: ['SUPER_ADMIN']}]), function(
    request: any,
    response: any,
    next: any,
  ) {
    const args = {
      id: {in: 'path', name: 'id', required: true, dataType: 'string'},
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    let validatedArgs: any[] = [];
    try {
      validatedArgs = getValidatedArgs(args, request);
    } catch (err) {
      return next(err);
    }

    const controller = new UsuarioController();

    const promise = controller.show.apply(controller, validatedArgs as any);
    promiseHandler(controller, promise, response, next);
  });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/api/v1/usuarios', authenticateMiddleware([{access_token: ['SUPER_ADMIN']}]), function(
    request: any,
    response: any,
    next: any,
  ) {
    const args = {
      data: {in: 'body', name: 'data', required: true, ref: 'UsuarioCreationRequest'},
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    let validatedArgs: any[] = [];
    try {
      validatedArgs = getValidatedArgs(args, request);
    } catch (err) {
      return next(err);
    }

    const controller = new UsuarioController();

    const promise = controller.save.apply(controller, validatedArgs as any);
    promiseHandler(controller, promise, response, next);
  });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put('/api/v1/usuarios/:id', authenticateMiddleware([{access_token: ['SUPER_ADMIN']}]), function(
    request: any,
    response: any,
    next: any,
  ) {
    const args = {
      id: {in: 'path', name: 'id', required: true, dataType: 'string'},
      data: {in: 'body', name: 'data', required: true, ref: 'UsuarioUpdateRequest'},
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    let validatedArgs: any[] = [];
    try {
      validatedArgs = getValidatedArgs(args, request);
    } catch (err) {
      return next(err);
    }

    const controller = new UsuarioController();

    const promise = controller.update.apply(controller, validatedArgs as any);
    promiseHandler(controller, promise, response, next);
  });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete('/api/v1/usuarios/:id', authenticateMiddleware([{access_token: ['SUPER_ADMIN']}]), function(
    request: any,
    response: any,
    next: any,
  ) {
    const args = {
      id: {in: 'path', name: 'id', required: true, dataType: 'string'},
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    let validatedArgs: any[] = [];
    try {
      validatedArgs = getValidatedArgs(args, request);
    } catch (err) {
      return next(err);
    }

    const controller = new UsuarioController();

    const promise = controller.delete.apply(controller, validatedArgs as any);
    promiseHandler(controller, promise, response, next);
  });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return (request: any, _response: any, next: any) => {
      let responded = 0;
      let success = false;

      const succeed = function(user: any) {
        if (!success) {
          success = true;
          responded++;
          request['user'] = user;
          next();
        }
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      const fail = function(error: any) {
        responded++;
        if (responded == security.length && !success) {
          error.status = error.status || 401;
          next(error);
        }
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          let promises: Promise<any>[] = [];

          for (const name in secMethod) {
            promises.push(expressAuthentication(request, name, secMethod[name]));
          }

          Promise.all(promises)
            .then(users => {
              succeed(users[0]);
            })
            .catch(fail);
        } else {
          for (const name in secMethod) {
            expressAuthentication(request, name, secMethod[name])
              .then(succeed)
              .catch(fail);
          }
        }
      }
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function isController(object: any): object is Controller {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
  }

  function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode;
        if (isController(controllerObj)) {
          const headers = controllerObj.getHeaders();
          Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
          });

          statusCode = controllerObj.getStatus();
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        if (data || data === false) {
          // === false allows boolean result
          response.status(statusCode || 200).json(data);
        } else {
          response.status(statusCode || 204).end();
        }
      })
      .catch((error: any) => next(error));
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function getValidatedArgs(args: any, request: any): any[] {
    const fieldErrors: FieldErrors = {};
    const values = Object.keys(args).map(key => {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return request;
        case 'query':
          return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {
            noImplicitAdditionalProperties: 'throw-on-extras',
            specVersion: 2,
          });
        case 'path':
          return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {
            noImplicitAdditionalProperties: 'throw-on-extras',
            specVersion: 2,
          });
        case 'header':
          return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {
            noImplicitAdditionalProperties: 'throw-on-extras',
            specVersion: 2,
          });
        case 'body':
          return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.', {
            noImplicitAdditionalProperties: 'throw-on-extras',
            specVersion: 2,
          });
        case 'body-prop':
          return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {
            noImplicitAdditionalProperties: 'throw-on-extras',
            specVersion: 2,
          });
      }
    });

    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, '');
    }
    return values;
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
