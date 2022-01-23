import {Controller, Get, OperationId, Request, Route, Tags} from 'tsoa';
import {versions} from '../versions';
export class HealthCheck {
  status: StatusApp;
  appInfo: AppInfo;
}

export class StatusApp {
  app: boolean;
  database: boolean;
  error: boolean;
  errors: string[];
}

export class AppInfo {
  version: String;
  revision: String;
  branch: String;
  buildDate: String;
  buildNumber: String;

  constructor(info: any) {
    this.version = info.version;
    this.revision = info.revision;
    this.branch = info.branch;
    this.buildDate = info.buildDate;
    this.buildNumber = info.buildNumber;
  }
}

@Tags('Health')
@Route('/')
export class HealthController extends Controller {
  /**
   * @summary Obtiene el estado de salud e información de la App
   */
  @Get('health')
  @OperationId('getHealthCheck')
  async health(@Request() request: any): Promise<HealthCheck> {
    let health = new HealthCheck();
    health.status = new StatusApp();
    health.status.app = true;
    health.status.database = true;
    health.appInfo = new AppInfo(versions);

    return health;
  }
}
