import { ComPropExample } from '../../../../_type';
import { CodeEditorProps } from '../ti-code-editor-types';

export default {
  name: 'css',
  text: 'i18n:ti-code-editor-example-css',
  comConf: {
    type: 'css',
    value: `/* 通用设置 */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

/* 标题样式 */
h1 {
  color: #333;
  text-align: center;
  padding: 20px 0;
}

/* 段落样式 */
p {
  color: #666;
  line-height: 1.6;
  padding: 10px 20px;
}

/* 链接样式 */
a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 按钮样式 */
button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
    `,
  } as CodeEditorProps,
} as ComPropExample;
