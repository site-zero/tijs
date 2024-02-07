import { FuncA2, Vars } from '../../../core';
import { Field, getFieldConvertor } from '../../';
import _ from 'lodash';

/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type FieldSerializerProps = Pick<
  Field,
  'name' | 'type' | 'defaultAs' | 'emptyAs' | 'serializer'
>;
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type FieldSerializerFeature = {
  prepareFieldValue: FuncA2<any, Vars, any>;
};
/*-------------------------------------------------------

                   Use Feature

-------------------------------------------------------*/
export function useFieldSerializer(
  props: FieldSerializerProps,
): FieldSerializerFeature {
  return {
    prepareFieldValue(val: any, data: Vars) {
      let { name, type, defaultAs, emptyAs, serializer } = props;

      if ('~~undefined~~' == defaultAs) {
        defaultAs = undefined;
      }
      if ('~~undefined~~' == emptyAs) {
        emptyAs = undefined;
      }

      // 无值的处理
      if (_.isNil(val)) {
        val = defaultAs;
      }
      // 空值的处理
      else if (_.isEmpty(val)) {
        val = emptyAs ?? defaultAs;
      }

      // 内置类型转换器
      if (!_.isNil(val)) {
        let cov = getFieldConvertor(type || 'String');
        val = cov.serialize(val);
      }

      // 定制转换器
      if (serializer) {
        val = serializer(val, data, name);
      }

      return val;
    },
  };
}
