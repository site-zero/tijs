export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    content: `
<article>
  <h1>这是一个测试页面</h1>
  <hr />
  <blockquote>可以插入很多元素</blockquote>
  <hr>
  而且可以自持插入动态Vue组件
  <ti-icon :value="'zmdi-cocktail'"/>
  <div class="zozoh">
    <ti-roadblock text="hello" icon="zmdi-cake"/> 
  </div>
</article>`,
  },
};
