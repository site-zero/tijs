import { ComPropExample } from '../../../../_type';
import {TreeTableProps } from '../ti-tree-table-types';
import { Chance } from 'chance';
import { getListData } from './mock_data';

// 创建一个 Chance 实例
const cha = new Chance();

export default {
  name: 'with_tip',
  text: 'i18n:ti-tree-table-example-with-tip',
  comConf: {
    columns: [],
    className: 'tip-block fit-parent',
    size: 'm',
    currentId: null,
    checkedIds: {},
    data: getListData({icon:false, tip:true}),
  } as TreeTableProps,
} as ComPropExample;
