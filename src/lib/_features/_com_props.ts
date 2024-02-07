/**
 * 所有控件都有的属性
 */
export type CommonProps = {
  /**
   * 大多数控件都可以接受一个属性，用来特殊指定自己的特殊类选择器
   */
  className?: any;

  /**
   * 指明自己进行事件通知的策略
   *
   * - `native`: 仅仅采用原生的 emit 事件消息，那么只有父控件才能有机会收到事件
   * - `bus`: 仅仅采用上层主组的 `bus` 总线（`inject(BUS_KEY)`）触发事件，如果没有总线就沉默
   * - `both`: 除了采用原生方式 emit 事件，如果上层注入了 `bus` 也会通知到
   * - `auto`: 【默认】自动判断，如果上层注入了 `bus` 则相当于 `bus模式`，否则相当于 `native模式`
   */
  emitMode?: 'auto' | 'both' | 'native' | 'bus';

  /**
   * 对于自己有子孙的控件，这个属性可以用来批量给自己的子孙设置 `emitMode`
   * 当然这需要控件的实现者，自行使用这个属性
   */
  childEmitMode?: 'auto' | 'both' | 'native' | 'bus';
};

/**
 * 需要展示文本的控件
 */
export type TextShowProps = {
  autoI18n?: boolean;
};
