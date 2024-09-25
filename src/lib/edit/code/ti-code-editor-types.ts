import { RoadblockProps } from '../../../lib';
import { CommonProps, ObjDataStatus, Vars, WindowTheme } from '../../../_type';

export type CodeEditorEmitter = {
  (event: 'change', payload: string): void;
};

export type CodeEditorProps = CommonProps & {
  style?: Vars;
  value?: any;
  editorStatus?: ObjDataStatus;
  editorStyle?: Vars;
  editorOptions?: Vars;
  editorTheme?: Record<WindowTheme, string>;
  theme?: WindowTheme | 'auto';
  type?: string;
  mime?: string;
  readonly?: boolean;

  format?: 'JSON' | 'JSON5' | ((str: string) => string);

  /**
   * 空白数据，显示的样式
   */
  emptyRoadblock?: RoadblockProps;
};
