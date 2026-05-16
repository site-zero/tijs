// export type CoolingKeyMatcher = (key: string) => boolean;

// export type BoxCompositionCooling = {
//   key: string[] | string | CoolingKeyMatcher;
//   cooling: number;
// };

export type BoxCompositionProps = {
  // 输入框，是否允许用户输入
  canInput?: boolean;
  // /**
  //  * 声明了这个选项，相当说，在某个键按下后一段时间不响应 __update_value
  //  * 默认的是
  //  * ```
  //  * [{keys: 'Escape|Enter', cooling: 300}]
  //  * ```
  //  * 表示按下 Escape 或者 Enter 键后，300ms 内不响应 __update_value
  //  */
  // waitCooling?: BoxCompositionCooling[];
};

export type BoxCompositionSetup = {
  isReadonly: () => boolean;
  onChange: (value: string) => void;
  funcKeys?: Record<string, () => Promise<void>>;
};
