import { Logger, LogLevel } from './log-types';

export class ConsoleLogger implements Logger {
  private _allow_lv: LogLevel = LogLevel.INFO;
  private _name: string;

  constructor(lv = LogLevel.INFO, name: string) {
    this._allow_lv = lv;
    this._name = name;
  }
  getName() {
    return this._name;
  }
  
  setLevel(lv: LogLevel) {
    this._allow_lv = lv;
  }

  _print(reqL: LogLevel, ...msg: any[]) {
    if (this._allow_lv >= reqL) {
      let lvName = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'][reqL];
      let prefix = `[${lvName}] ${this._name}:`;
      if (reqL == LogLevel.ERROR) {
        console.error(prefix, ...msg);
      } else if (reqL == LogLevel.WARN) {
        console.warn(prefix, ...msg);
      } else if (reqL == LogLevel.INFO) {
        console.info(prefix, ...msg);
      } else {
        console.log(prefix, ...msg);
      }
    }
  }

  error(...msg: any[]) {
    this._print(LogLevel.ERROR, ...msg);
  }
  warn(...msg: any[]) {
    this._print(LogLevel.WARN, ...msg);
  }
  info(...msg: any[]) {
    this._print(LogLevel.INFO, ...msg);
  }
  debug(...msg: any[]) {
    this._print(LogLevel.DEBUG, ...msg);
  }
  trace(...msg: any[]) {
    this._print(LogLevel.TRACE, ...msg);
  }
  isErrorEnabled() {
    return LogLevel.ERROR <= this._allow_lv;
  }
  isWarnEnabled() {
    return LogLevel.WARN <= this._allow_lv;
  }
  isInfoEnabled() {
    return LogLevel.INFO <= this._allow_lv;
  }
  isDebugEnabled() {
    return LogLevel.DEBUG <= this._allow_lv;
  }
  isTraceEnabled() {
    return LogLevel.TRACE <= this._allow_lv;
  }
}
