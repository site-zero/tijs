import _ from 'lodash';
import { Convertor, Field, Vars, getFieldConvertor } from '../../../_type';

/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type FieldTransformerProps = Pick<
  Field,
  'name' | 'type' | 'transformer'
>;
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type FieldTransformerFeature = {
  getFieldValue: Convertor<Vars, any>;
};
/*-------------------------------------------------------

                   Use Feature

-------------------------------------------------------*/
export function useFieldTransformer(
  props: FieldTransformerProps
): FieldTransformerFeature {
  return {
    getFieldValue(data: Vars) {
      let { name, type, transformer } = props;
      let val;
      if (_.isString(name)) {
        val = _.get(data, name);
      }
      // 获取子对象
      else {
        val = _.pick(data, name);
      }
      // 内置类型转换器
      if (!_.isNil(val)) {
        let cov = getFieldConvertor(type || 'String');
        val = cov.transform(val);
      }

      // 定制转换器
      if (transformer) {
        val = transformer(val, data, name);
      }

      return val;
    },
  };
}
