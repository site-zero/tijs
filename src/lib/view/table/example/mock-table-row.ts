import { Vars } from "../../../../core";
import { generateUser } from "./fake_data";

export function mockData(n = 10): Vars[] {
  let list = [] as Vars[];
  for (let i = 0; i < n; i++) {
    list.push(generateUser());
  }
  return list;
}