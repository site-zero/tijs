import { Vars } from '../../../../_type';
import { generateIcon, generateText } from '../../table/example/fake_data';

export function mockWallData(n = 10): Vars[] {
  let re = [] as Vars[];
  for (let i = 0; i < n; i++) {
    let u = {
      name: generateText(),
    } as Vars;
    u.icon = generateIcon();
    re.push(u);
  }
  return re;
}
