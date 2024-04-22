import _ from 'lodash';
import { ConsoleLogger } from './console-logger';
import { Logger, LogLevel, LogLvNames, LogLvNameTable } from './log-types';

export * from './log-types';

type LOG_LV_ROW = [string, LogLevel];
const LL = {
  _DFT: LogLevel.INFO,
  _LVS: [] as LOG_LV_ROW[],
  _loggers: {} as Record<string, Logger>,
};

export function getCallerInfo(callerAt=4) {
  try {
    // 抛出一个错误，然后立即捕获它
    throw new Error();
  } catch (error) {
    let err = error as any;
    // Error 的 stack 属性包含了堆栈追踪信息
    if (err.stack) {
      // 处理这个 stack 信息以找到调用者信息
      // 注意：这种方式依赖于特定的运行环境和堆栈格式，可能需要根据环境不同进行调整
      const stackLines = err.stack.split('\n');
      // 以一种通用方式，我们可能需要找到除当前函数外的第一个“at ”位置
      // 这通常是调用者的堆栈行，格式和具体的 JavaScript 引擎实现有关

      // 例如，假设我们的函数调用在栈中的第四行
      // 这可能需根据您的实际堆栈结构进行调整
      if (stackLines[callerAt]) {
        console.log(stackLines[callerAt]); // 这里输出调用者信息
        return stackLines[callerAt];
      }
    }
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
