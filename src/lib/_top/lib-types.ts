import { IconInput } from '../../core';

/*---------------------------------------------------

                      通用结构

---------------------------------------------------*/
export interface FieldStatusIcons {
  pending: IconInput;
  error: IconInput;
  warn: IconInput;
  ok: IconInput;
  highlight: IconInput;
}
export type FieldStatusType = keyof FieldStatusIcons;
export type FieldStatus = {
  /**
   * 状态类型
   */
  type: FieldStatusType;

  /**
   * 状态描述文字
   */
  text: string;
};

export type WnObjStatus = {
  removed: boolean; // 显示已经删除的标记
  processing: number; // 0-1 表示进度，通常用在上传
  done: boolean; // 显示已经完成的标记
  uploaded: boolean; // 显示已经上传成功的标记
};

/*---------------------------------------------------

                      Sidebar

---------------------------------------------------*/
export type SideBarItem = {
  key: string;
  depth: number;
  current?: boolean;
  id: string;
  path?: string;
  href?: string;
  icon?: IconInput;
  title?: string;
  items?: SideBarItem[];
};

/*---------------------------------------------------

                      Pager

---------------------------------------------------*/
export type Pager = {
  // ShortNamePager
  pn?: number; //"pageNumber",
  pgsz?: number; //"pageSize",
  pgc?: number; //"pageCount",
  sum?: number; //"totalCount",
  // LongNamePager
  pageNumber?: number;
  pageSize?: number;
  pageCount?: number;
  totalCount?: number;
  // Suammary
  count?: number; //"count",
  skip?: number; //"skip",
  limit?: number; //"limit"
};