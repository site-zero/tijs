import { ComPropExample } from '../../../../_type';
import { CodeEditorProps } from '../ti-code-editor-types';

export default {
  name: 'js',
  text: 'i18n:ti-code-editor-example-js',
  comConf: {
    type: 'js',
    value: `// JavaScript 示例

// 打印消息到控制台
console.log("Hello, world!");

// 定义一个函数
function greet(name) {
  return "Hello, " + name + "!";
}

// 使用函数
var message = greet("Alice");
console.log(message);

// 对象示例
var person = {
  name: "John Doe",
  age: 30,
  greet: function() {
    console.log("Hello, my name is " + this.name);
  }
};

// 调用对象的方法
person.greet();

// 数组示例
var fruits = ["apple", "banana", "cherry"];
fruits.forEach(function(fruit) {
  console.log(fruit);
});`,
  } as CodeEditorProps,
} as ComPropExample;
