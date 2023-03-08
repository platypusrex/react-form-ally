type AnyObject<T = any> = Record<string, T>;
export const isEqualObj = (obj: AnyObject, source: AnyObject) =>
  Object.keys(source).every((key) => obj.hasOwnProperty(key) && obj[key] === source[key]);
