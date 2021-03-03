import { sections } from './prefectures.json';

export const prefectures = Object.fromEntries(
  Object.entries(sections).map(
    ([section, list]) => [section, list.map(({ key }) => key)]
  )
);

export const pick = arr => arr[Math.random() * arr.length | 0];

export const pickMap = obj => {
  const key = pick(Object.keys(obj));
  return [key, pick(obj[key])];
}

export const zip = (a, b) => a.map((e, i) => [e, b[i]]);

export class Test {
  constructor(value) {
    this.value = value;
  }
  bla() { return 42 * this.value }
}
