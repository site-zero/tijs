import _ from 'lodash';
import { Vars } from '../../../../_type';

type get_options = { icon: boolean; tip: boolean };
export function getListData(
  { icon = true, tip = true } = {} as get_options,
  n = 6
): Vars[] {
  let cans = [
    {
      value: 1,
      text: 'This is a DOG',
      icon: 'fas-dog',
      tip: 'Dogs are natural chewers and bones provide them with a satisfying activity that can help clean their teeth and keep them mentally stimulated. ',
    },
    {
      value: 2,
      text: 'This is a CAT',
      icon: 'fas-cat',
      tip: 'Cats are obligate carnivores, which means that they require a diet high in protein and fish is a good source of protein for them.',
    },
    {
      value: 3,
      text: 'This is a HIPPO',
      icon: 'fas-hippo',
      tip: 'Hippo like bath',
    },
    { value: 4, text: 'This is a FROG', icon: 'fas-frog' },
    { value: 5, text: 'This is a LIZARD' },
    { value: 6, text: 'This is a FISH', icon: 'fas-fish' },
  ] as Vars[];
  let list = [];
  for (let li of cans) {
    let it: Vars;
    if (icon && tip) {
      it = _.cloneDeep(li);
    } else if (icon) {
      it = _.omit(li, 'tip');
    } else if (tip) {
      it = _.omit(li, 'icon');
    } else {
      it = _.omit(li, 'icon', 'tip');
    }
    list.push(it);
  }

  if (n > 0) {
    return list.slice(0, n);
  }
  return list;
}
