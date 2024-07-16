import { ComPropExample } from '../../../../_type';
import { CodeEditorProps } from '../ti-code-editor-types';

export default {
  name: 'html',
  text: 'i18n:ti-code-editor-example-html',
  comConf: {
    type: 'html',
    value: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>示例 HTML 页面</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>欢迎来到我的网站</h1>
  </header>

  <nav>
    <ul>
      <li><a href="#home">首页</a></li>
      <li><a href="#about">关于我们</a></li>
      <li><a href="#contact">联系我们</a></li>
    </ul>
  </nav>

  <main>
    <section id="home">
      <h2>首页</h2>
      <p>这是一个简单的 HTML 示例页面。</p>
    </section>

    <section id="about">
      <h2>关于我们</h2>
      <p>我们致力于提供优质的服务。</p>
    </section>

    <section id="contact">
      <h2>联系我们</h2>
      <p>通过邮箱 <a href="mailto:info@example.com">info@example.com</a> 联系我们。</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 我的公司</p>
  </footer>
</body>
</html>
`,
  } as CodeEditorProps,
} as ComPropExample;
