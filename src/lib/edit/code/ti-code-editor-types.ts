import { CommonProps, Vars, WindowTheme } from '../../../_type';

export type CodeEditorEmitter = {
  (event: 'change', payload: string): void;
};

export type CodeEditorProps = CommonProps & {
  style?: Vars;
  value?: any;
  editorStyle?: Vars;
  editorOptions?: Vars;
  editorTheme?: Record<WindowTheme, string>;
  theme?: WindowTheme | 'auto';
  type?: string;
  mime?: string;
  readonly?: boolean;
};
