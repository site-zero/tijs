import { compile, h } from 'vue';
import { Vars } from '../../../_type';

export type RenderPageProps = {
  className?: any;
  style?: Vars;
  content?: string;
};

export function RenderPage(props: RenderPageProps) {
  let re = compile(props.content ?? '<article>No Conetnt</article>');
  return h(re);
}
