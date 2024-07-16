import { ComPropExample } from '../../../../_type';
import { CodeEditorProps } from '../ti-code-editor-types';

export default {
  name: 'markdown',
  text: 'i18n:ti-code-editor-example-markdown',
  comConf: {
    type: 'md',
    value: `# Markdown 示例

这是一个简单的 Markdown 文件示例。

## 标题

Markdown 支持多级标题：

### 三级标题

#### 四级标题

## 列表

无序列表：

- 项目一
- 项目二
- 项目三

有序列表：

1. 第一步
2. 第二步
3. 第三步

## 链接与图片

这是一个 [链接](https://www.example.com) 示例。

这是一个图片示例：

![替代文本](https://www.example.com/image.jpg)

## 代码块

以下是一个代码块示例：

\`\`\`python
def hello_world():
    print("Hello, world!")
\`\`\`

> 上面是代码示例`,
  } as CodeEditorProps,
} as ComPropExample;
