import { LayoutGridProps } from '../layout/grid/use-layout-grid';
import { LayoutPanel } from '../layout/layout-panel';
import { LayoutBlock } from '../layout/layout-support';
import { PlayLayoutMode } from './use-play-mode';

export function useGridLayout(mode: PlayLayoutMode): LayoutGridProps {
  function getGridBlocks(): LayoutBlock[] {
    if ('F' == mode) {
      return [
        {
          name: 'tabs',
        },
        {
          name: 'live',
        },
      ];
    }
    if ('V' == mode) {
      return [
        {
          name: 'tabs',
          grid: {
            gridRow: 'span 2',
          },
          bar: {
            mode: 'column',
            adjustIndex: 0,
            position: 'next',
          },
        },
        {
          name: 'live',
          bar: {
            mode: 'row',
            adjustIndex: 0,
            position: 'next',
          },
        },
        { name: 'conf' },
      ];
    }
    // mode == H
    return [
      {
        name: 'tabs',
        grid: {
          gridColumn: 'span 2',
        },
      },
      {
        name: 'live',
        bar: {
          mode: 'column',
          adjustIndex: 0,
          position: 'next',
        },
      },
      { name: 'conf' },
    ];
  }

  function getGridLayout() {
    if ('F' == mode) {
      return {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
        gap: '10px',
      };
    }
    if ('V' == mode) {
      return {
        gridTemplateColumns: '10em 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '10px',
      };
    }
    // mode == H
    return {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto 1fr',
      gap: '10px',
    };
  }

  function getPanels(): LayoutPanel[] {
    if ('F' == mode) {
      return [
        {
          name: 'conf',
          position: 'left',
          clickMaskToClose: true,
          left: '30px',
          top: '30px',
          width: '61.8%',
          height: '98%',
          minWidth: '200px',
          maxWidth: '640px',
        },
      ];
    }
    return [];
  }

  return {
    className: 'fit-parent as-card r-s',
    itemStyle: {
      backgroundColor: 'var(--ti-color-card)',
    },
    keepSizes: {
      keepMode: 'session',
      keepAt: `Ti-Playground-Layout-${mode}`,
    },
    layout: getGridLayout(),
    blocks: getGridBlocks(),
    panels: getPanels(),
  };
}
