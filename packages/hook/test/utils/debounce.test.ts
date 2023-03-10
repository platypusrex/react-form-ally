import { debounce } from '../../src/utils';

const delay = (ms: number): Promise<boolean> =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));

describe('debounce', () => {
  it('debounces a function', async () => {
    let count = 0;

    const debounced = debounce((value: number) => {
      count++;
      return value;
    }, 20);

    expect(debounced(1)).toEqual(undefined);
    debounced(2);
    debounced(3);

    await delay(100);
    debounced(4);
    debounced(5);
    debounced(6);
    expect(count).toBe(1);

    await delay(200);
    expect(count).toBe(2);
  });

  it('should not debounce a fn if no wait time is provided', async () => {
    let count = 0;

    const debounced = debounce((value) => {
      count++;
      return value;
    });

    expect(debounced(1)).toEqual(1);
    expect(debounced(2)).toEqual(2);
    expect(debounced(3)).toEqual(3);
    expect(count).toEqual(3);
  });

  it('should cancel the current debounce fn', async () => {
    let count = 0;

    const debounced = debounce((value) => {
      count++;
      return value;
    }, 20);

    expect(debounced(1)).toBeUndefined();
    expect(debounced(2)).toBeUndefined();
    expect(debounced(3)).toBeUndefined();

    debounced.cancel();

    await delay(100);
    expect(debounced(1)).toBeUndefined();
    expect(debounced(2)).toBeUndefined();
    expect(debounced(3)).toBeUndefined();
    expect(count).toEqual(0);
  });
});
