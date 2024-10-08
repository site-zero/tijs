import { Logger, LogLevel } from '../../_type/log-types';
import { _find_logger_level, getCallerInfo } from './ti-log';

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

  _print(reqLvl: LogLevel, ...msg: any[]) {
    this.__check_log_ready();
    if (this._allow_lv >= reqLvl) {
      let lvName = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'][reqLvl];
      let caller = getCallerInfo();
      let prefix = `[${lvName}]${this._name}:`;
      let callAts = [caller.fileName || this._name];
      if (caller.line >= 0) {
        callAts.push(`#${caller.line}`);
      }
      if (caller.methodName) {
        if (/^Object\./.test(caller.methodName)) {
          callAts.push(caller.methodName.substring(7));
        } else {
          callAts.push(caller.methodName);
        }
      }
      let callAt = callAts.join(':');
      // console.log(`${fileName}:${line}: ${source}`);
      if (reqLvl == LogLevel.ERROR) {
        //console.error(`>>>`, caller.source);
        console.error(prefix, callAt, ':', ...msg);
      } else if (reqLvl == LogLevel.WARN) {
        //console.warn(`>>>`, caller.source);
        console.warn(prefix, callAt, ':', ...msg);
      } else if (reqLvl == LogLevel.INFO) {
        //console.info(`>>>`, caller.source);
        console.info(prefix, callAt, ':', ...msg);
      } else {
        //console.log(`>>>`, caller.source);
        console.log(prefix, callAt, ':', ...msg);
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
