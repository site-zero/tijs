import { ComPropExample } from '../../../../_type';
import { TreeProps } from '../ti-tree-types';
import { Chance } from 'chance';
import { getListData } from './mock_data';

// 创建一个 Chance 实例
const cha = new Chance();

export default {
  name: 'with_tip',
  text: 'i18n:ti-tree-example-with-tip',
  comConf: {
    className: 'tip-block fit-parent',
    size: 'm',
    currentId: null,
    checkedIds: {},
    data: getListData({icon:false, tip:true}),
  } as TreeProps,
} as ComPropExample;
