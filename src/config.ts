const envSettings = window as any;
export class Config {
  static APP_SUB_PATH = envSettings.APP_SUB_PATH;
  static API_SUB_PATH = envSettings.API_SUB_PATH;
}
