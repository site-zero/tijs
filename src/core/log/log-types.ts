export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

export type LogLvNames = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export const LogLvNameTable = {
  ERROR: LogLevel.ERROR,
  WARN: LogLevel.WARN,
  INFO: LogLevel.INFO,
  DEBUG: LogLevel.DEBUG,
  TRACE: LogLevel.TRACE,
} as Record<LogLvNames, LogLevel>;

export interface Logger {
  getName: () => string;
  setLevel: (lv: LogLevel) => void;
  error: (...msg: any[]) => void;
  warn: (...msg: any[]) => void;
  info: (...msg: any[]) => void;
  debug: (...msg: any[]) => void;
  trace: (...msg: any[]) => void;
  isErrorEnabled: () => boolean;
  isWarnEnabled: () => boolean;
  isInfoEnabled: () => boolean;
  isDebugEnabled: () => boolean;
  isTraceEnabled: () => boolean;
}
