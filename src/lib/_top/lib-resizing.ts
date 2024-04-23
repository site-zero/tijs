export type GridResizingState = {
  /**
   * 格子的列，如果为空，就表示未定制，将采用默认设置
   */
  columns: string[];
  /**
   * 格子的行，如果为空，就表示未定制，将采用默认设置
   */
  rows: string[];
};
