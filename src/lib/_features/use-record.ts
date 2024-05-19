/**
 * 这里集合了对一条记录的所有的相关处理逻辑，
 * 以便再控件或者数据模型中使用。 这些处理逻辑包括：
 * 1. 数据检查:
 *    a. 检查数据是否都填写了必填项目
 *    b. 检查数据格式是否符合要求
 * 2. 数据联动
 *    a. 如果某个字段的修改，自动按照设定逻辑修改关联字段
 * 3. 数据整合
 *    a. 只获得差异
 *    b. 拼合全量数据
 *    c. 明知对列表
 */
export type RecordProps = {

}

export function useRecord() {

}

/**
 * 当记录修改后，怎么向外通知改动
 *
 * > 譬如，如果你修改了一个字段 `{name:'age', value: 40, oldVal:38}`
 *  - `diff` 只通知差异 `{age: 40}`
 *  - `all` 全量结果 `{... age:40 ...}`
 *  - `pair` 通知原始的明值对信息: `[ {name:'age', value: 40, oldVal:38} ...]`
 */
export type RecordChangeMode = 'diff' | 'all' | 'pair';