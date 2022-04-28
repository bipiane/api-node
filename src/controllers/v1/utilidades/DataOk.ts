export class DataOk {
  result = 'ok';
  status = 200;
  data: any; // eslint-disable-line
  userMessage: string;
  actions: string;

  constructor(status: number, userMessage: string = null, actions: string = null) {
    this.status = status;
    this.userMessage = userMessage;
    this.actions = actions;
  }
}
