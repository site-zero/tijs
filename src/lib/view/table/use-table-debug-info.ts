export type TableScrolling = {
  viewport: { width: number; height: number };
  lineHeights: number[];
  defaultLineHeight: number;
  lineCount: number;
  scrollTop: number;
  cacheZoneHeight: number;
  lineMarkers: number[];
};

export function getTableDebugInfo(
  scrolling: TableScrolling,
  showDebug = false
) {
  let scopes = [];
  if (showDebug) {
    let from: number = -1;
    let marks = scrolling.lineMarkers;
    for (let i = 0; i < marks.length; i++) {
      if (!marks[i]) {
        if (from >= 0) {
          scopes.push(`${from + 1}-${i}`);
        }
        from = -1;
      } else if (from < 0) {
        from = i;
      }
    }
    if (from >= 0 && from < marks.length) {
      scopes.push(`${from + 1}-${marks.length}`);
    }
  }
  return scopes;
}
