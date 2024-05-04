export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    items: [
      {
        key: 'A',
        path: '/pets',
        icon: 'fas-shield-cat',
        title: 'Pets',
        depth: 0,
        items: [
          {
            key: 'A-1',
            path: '/pets/dog',
            icon: 'fas-dog',
            title: 'Dog',
            depth: 1,
          },
          {
            key: 'A-2',
            path: '/pets/cat',
            icon: 'fas-cat',
            title: 'Cat',
            depth: 1,
          },
          {
            key: 'A-3',
            path: '/pets/dove',
            icon: 'fas-dove',
            title: 'Dove',
            depth: 1,
          },
        ],
      },
      {
        key: 'B',
        path: '/foods',
        icon: 'fas-utensils',
        title: 'Foods',
        depth: 0,
        items: [
          {
            key: 'B-1',
            path: '/foods/burger',
            icon: 'fas-burger',
            title: 'Hamburger',
            depth: 1,
          },
          {
            key: 'B-2',
            path: '/foods/pizza',
            icon: 'fas-pizza-slice',
            title: 'Pizza',
            depth: 1,
          },
          {
            key: 'B-3',
            path: '/foods/rice',
            icon: 'fas-bowl-rice',
            title: 'Rice',
            depth: 1,
          },
        ],
      },
      {
        key: 'C',
        path: '/cities',
        title: 'Cities',
        depth: 0,
        items: [
          {
            key: 'C-1',
            path: '/cities/bj',
            icon: 'fas-vihara',
            title: 'BeiJing',
            depth: 1,
          },
          {
            key: 'C-2',
            path: '/cities/sh',
            icon: 'fas-torii-gate',
            title: 'ShangHai',
            depth: 1,
          },
          {
            key: 'C-3',
            path: '/cities/gz',
            icon: 'fas-church',
            title: 'GuangZhou',
            depth: 1,
          },
        ],
      },
    ],
  },
};
