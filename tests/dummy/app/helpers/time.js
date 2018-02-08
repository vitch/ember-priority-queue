import { helper } from '@ember/component/helper';

export function time([seconds]) {
  let d = new Date(seconds);

  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:`;
}

export default helper(time);
