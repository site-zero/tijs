import { TiStore } from '../../../core';

/**
 * # mode = H
 *
 * ```bash
 * +---------------------------+
 * |           Tabs            |
 * +-------------+-------------+
 * |             |             |
 * |             |             |
 * |    Live     |   comConf   |
 * |             |   <error>   |
 * |             |             |
 * +-------------+-------------+
 * |[BG][MD]    Messages       |
 * +---------------------------+
 * ```
 *
 * # mode = V
 *
 * ```bash
 * +--------+------------------+
 * |        |                  |
 * |        |      Live        |
 * |  Tabs  |                  |
 * |        +------------------+
 * |        |                  |
 * |        |     comConf      |
 * |        |     <error>      |
 * +--------+------------------+
 * |[BG][MD]    Messages       |
 * +---------------------------+
 * ```
 *
 * # mode = F
 *
 * ```bash
 * +---------------------------+
 * |           Tabs            |
 * +---------------------------+
 * |                           |
 * |                           |
 * |           Live            |
 * |                           |
 * |                           |
 * +---------------------------+
 * |[BG][MD]    Messages    [<]|
 * +---------------------------+
 * ```
 */
export type PlayLayoutMode = 'H' | 'V' | 'F';

const PLY_MODE_KEY = 'Ti-Playground-Mode-Play';

export function loadPlayLayoutMode(): PlayLayoutMode {
  let mode = TiStore.local.getString(PLY_MODE_KEY, 'F');
  switch (mode) {
    case 'H':
    case 'V':
    case 'F':
      return mode;
  }
  return 'H';
}

export function savePlayLayoutMode(mode: PlayLayoutMode) {
  TiStore.local.set(PLY_MODE_KEY, mode);
}

export type LiveBgMode = 'none' | 'fill';

const LIVE_BG_MODE_KEY = 'Ti-Playground-Mode-Live-BG';

export function loadLiveBgMode(): LiveBgMode {
  let mode = TiStore.local.getString(LIVE_BG_MODE_KEY, 'fill');
  switch (mode) {
    case 'none':
    case 'fill':
      return mode;
  }
  return 'none';
}

export function saveLiveBgMode(mode: LiveBgMode) {
  TiStore.local.set(LIVE_BG_MODE_KEY, mode);
}
