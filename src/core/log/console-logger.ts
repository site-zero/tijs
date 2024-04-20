import { Logger, LogLevel } from './log-types';
import { _find_logger_level } from './ti-log';

export class ConsoleLogger implements Logger {
  private _allow_lv: LogLevel = LogLevel.INFO;
  private _ready: boolean = false;
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }
  getName() {
    return this._name;
  }

  setLevel(lv: LogLevel) {
    this._allow_lv = lv;
  }

  // 因为 main.ts 会晚些时候设置 logger 的level,因此用一个状态位，延迟获取日志级别
  __check_log_ready() {
    if (!this._ready) {
      this._allow_lv = _find_logger_level(this._name);
      this._ready = true;
    }
  }

  _print(reqL: LogLevel, ...msg: any[]) {
    this.__check_log_ready();
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
    this.__check_log_ready();
    return LogLevel.ERROR <= this._allow_lv;
  }
  isWarnEnabled() {
    this.__check_log_ready();
    return LogLevel.WARN <= this._allow_lv;
  }
  isInfoEnabled() {
    this.__check_log_ready();
    return LogLevel.INFO <= this._allow_lv;
  }
  isDebugEnabled() {
    this.__check_log_ready();
    return LogLevel.DEBUG <= this._allow_lv;
  }
  isTraceEnabled() {
    this.__check_log_ready();
    return LogLevel.TRACE <= this._allow_lv;
  }
}
