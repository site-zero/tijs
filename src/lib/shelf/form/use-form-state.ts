import _ from 'lodash';
import { Vars } from '../../../core';
import { FormProps } from './ti-form-types';

export type FormState = {
  data: Vars;
  context: Vars;
};

export function updateFormState(
  state: FormState,
  parts: Pick<FormProps, 'data' | 'vars' | 'fixed'>
) {
  _.assign(state.data, parts.data);
  _.assign(state.context, parts.data, parts.fixed, parts.vars);
}
