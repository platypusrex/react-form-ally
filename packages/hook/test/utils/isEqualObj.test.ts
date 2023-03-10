import { isEqualObj } from "../../src/utils";

describe('isEqualObj', () => {
  it('should return true if provided objects have same key/value pairs', () => {
    const result = isEqualObj({ foo: 'bar', bar: 'foo' }, { bar: 'foo', foo: 'bar' });
    expect(result).toEqual(true);
  });

  it('should return true if provided objects have same key/value pairs', () => {
    const result = isEqualObj({ foo: 'bar' }, { bar: 'foo', foo: 'bar' });
    expect(result).toEqual(false);
  });
});
