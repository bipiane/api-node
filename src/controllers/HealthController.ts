import {Controller, Get, OperationId, Route, Tags} from 'tsoa';
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
  version: string;
  revision: string;
  branch: string;
  buildDate: string;
  buildNumber: string;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
  async health(): Promise<HealthCheck> {
    const health = new HealthCheck();
    health.status = new StatusApp();
    health.status.app = true;
    health.status.database = true;
    health.appInfo = new AppInfo(versions);

    return health;
  }
}
