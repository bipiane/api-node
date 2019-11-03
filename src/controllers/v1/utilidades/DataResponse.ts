export class DataResponse {
  /**
   * @deprecated
   * @param userMessage
   * @param status
   * @param developerMessage
   * @param validationErrors
   */
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
