export class DataOk {
  result: string = 'ok';
  status: number = 200;
  data: any;
  userMessage: string;
  actions: string;

  constructor(status: number, userMessage: string, actions: string) {
    this.status = status;
    this.userMessage = userMessage;
    this.actions = actions;
  }
}
