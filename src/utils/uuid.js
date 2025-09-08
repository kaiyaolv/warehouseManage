// 生成32位随机字符串
export function uuid() {
  const len = 32;      //32长度
  // let radix = 16;    //16进制
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  // radix = radix || chars.length;
  let radix = chars.length;
  if (len) {
      for (i = 0; i < len; i++) {
          uuid[i] = chars[0 | Math.random() * radix];
      }
  } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
      }
  }
  return uuid.join('');
}
