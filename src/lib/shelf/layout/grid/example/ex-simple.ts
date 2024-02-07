export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    className: 'fit-parent as-card r-b',
    keepShown: {
      keepAt: 'Ti-Demo-simple-Shown',
    },
    keepSizes: {
      keepAt: 'Ti-Demo-simple-Sizes',
    },
    style: {
      padding: '10px',
    },
    itemStyle: {
      backgroundColor: '#FFEE66',
    },
    layout: {
      gridTemplateColumns: '1fr 2fr',
      gridTemplateRows: '1fr 1.8fr',
      gap: '10px',
    },
    blocks: [
      {
        name: 'search',
        type: 'grid',
        layout: {
          gridTemplateRows: 'auto 1fr auto',
          gap: '0px',
        },
        grid: {
          gridRow: 'span 2',
        },
        bar: {
          mode: 'column',
          adjustIndex: 0,
          position: 'next',
        },
        blocks: [
          {
            name: 'filter',
          },
          {
            name: 'list',
          },
          {
            name: 'pager',
          },
        ],
      },
      {
        name: 'info',
      },
      {
        name: 'detail',
        bar: {
          mode: 'row',
          adjustIndex: 1,
          position: 'prev',
        },
      },
    ],
    schema: {
      filter: {
        comType: 'TiLabel',
        comConf: {
          value: '过滤条',
        },
      },
      list: {
        comType: 'TiRoadblock',
        comConf: {
          className: 'is-info-r',
          text: '列表区',
          icon: 'zmdi-format-list-bulleted',
        },
      },
      pager: {
        comType: 'TiLabel',
        comConf: {
          value: '翻页条',
        },
      },
      info: {
        comType: 'TiRoadblock',
        comConf: {
          className: 'is-text',
          text: '信息区',
          icon: 'zmdi-info',
        },
      },
      detail: {
        comType: 'TiRoadblock',
        comConf: {
          className: 'is-warn-r',
          text: '详情区',
          icon: 'zmdi-navigation',
        },
      },
    },
  },
};
