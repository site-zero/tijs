import _ from 'lodash';
import { Logger, LogLevel, LogLvNames, LogLvNameTable } from '../../_type/';
import { ConsoleLogger } from './console-logger';

type LOG_LV_ROW = [string, LogLevel];
const LL = {
  _DFT: LogLevel.INFO,
  _LVS: [] as LOG_LV_ROW[],
  _loggers: {} as Record<string, Logger>,
};

type CallerInfo = {
  fileName: string;
  methodName: string;
  line: number;
  column: number;
  source?: string;
};

export function getCallerInfo(callerAt = 4): CallerInfo {
  try {
    // 抛出一个错误，然后立即捕获它
    throw new Error();
  } catch (error) {
    let err = error as any;
    // Error 的 stack 属性包含了堆栈追踪信息

    let info: CallerInfo = {
      methodName: 'unknown',
      fileName: 'unknown',
      line: -1,
      column: -1,
    };
    if (err.stack) {
      const stackLines = err.stack.split('\n');
      if (stackLines[callerAt]) {
        let stackLine = stackLines[callerAt];
        let m = /^\s*at\s+(([^()]+)\s+)?(\((.+)\)|(.+))$/.exec(stackLine);
        //console.error("+++", stackLine)
        if (m) {
          info.methodName = _.trim(m[2]);
          info.source = _.trim(m[4] || m[5]);
          let ss = info.source.split(/\/+/g);
          let str = ss[ss.length - 1];
          let flds = str.split(/[?:]+/g);
          info.fileName = flds[0];
          info.line = parseInt(flds[flds.length - 2]);
          info.column = parseInt(flds[flds.length - 1]);
        }
        // 警告一下
        else {
          info.source = stackLine;
          console.warn(`Fail to parse stackLine[${callerAt}]: `, stackLine);
        }
      }
    }

    return info;
  }
}

export function _find_logger_level(name?: string): LogLevel {
  if (!name || '_DFT' == name) {
    return LL._DFT;
  }

  for (let row of LL._LVS) {
    if (name.startsWith(row[0])) {
      return row[1];
    }
  }

  return LogLevel.INFO;
}

export function getLogger(name?: string): Logger {
  let key = name || '_DFT';
  let re = LL._loggers[key];
  if (re) {
    return re;
  }
  re = new ConsoleLogger(key);
  LL._loggers[re.getName()] = re;
  return re;
}

export function getDefaultLogLevel() {
  return LL._DFT;
}

export function setDefaultLogLevel(lv: LogLevel) {
  LL._DFT = lv;
}

export function getLogLevel(lv: string): LogLevel;
export function getLogLevel(lv: LogLvNames): LogLevel;
export function getLogLevel(lv: string | LogLvNames): LogLevel {
  let k: LogLvNames;
  if (!/^(ERROR|WARN|INFO|DEBUG|TRACE)$/.test(lv)) {
    lv = lv.toUpperCase();
  }
  if (!/^(ERROR|WARN|INFO|DEBUG|TRACE)$/.test(lv)) {
    console.warn(`invalid LogLevel: ${lv}`);
    lv = 'INFO';
  }
  k = lv as unknown as LogLvNames;
  return LogLvNameTable[k];
}

export function addLogger(name: string, logLevel: LogLevel) {
  let lv = _.isString(logLevel) ? getLogLevel(logLevel) : logLevel;

  for (let row of LL._LVS) {
    if (row[0] == name) {
      row[1] = lv;
      return;
    }
  }

  LL._LVS.push([name, lv]);
}

export function tidyLogger() {
  LL._LVS
    .sort((a, b) => {
      // 返回负数表示 a 应该在 b 前面
      if (a[0] < b[0]) {
        return -1;
      }
      // 返回正数表示 b 应该在 a 前面
      if (a[0] > b[0]) {
        return 1;
      }
      // 返回0表示 a 和 b 相等
      return 0;
    })
    .reverse();
  //console.log(LL._LVS.join("\n"))

  for (let logger of _.values(LL._loggers)) {
    let newLv = _find_logger_level(logger.getName());
    logger.setLevel(newLv);
  }
}
