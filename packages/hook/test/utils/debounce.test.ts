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

// test('debounces a function', async (t) => {
//   let count = 0;
//
//   const debounced = debounce((value) => {
//     count++;
//     return value;
//   }, 20);
//
//   t.is(debounced(1), undefined);
//   t.is(debounced(2), undefined);
//   t.is(debounced(3), undefined);
//
//   await delay(100);
//   t.is(debounced(4), 3);
//   t.is(debounced(5), 3);
//   t.is(debounced(6), 3);
//   t.is(count, 1);
//
//   await delay(200);
//   t.is(count, 2);
// });
//
// test('before:false after:false options', (t) => {
//   t.throws(
//     () => {
//       debounce(() => null, 20);
//     },
//     {
//       message: "Both `before` and `after` are false, function wouldn't be called.",
//     }
//   );
// });
//
// test('before:true after:false options', async (t) => {
//   let count = 0;
//
//   const debounced = debounce((value) => {
//     count++;
//     return value;
//   }, 20);
//
//   t.is(debounced(1), 1);
//   t.is(debounced(2), 1);
//   t.is(debounced(3), 1);
//   t.is(count, 1);
//
//   await delay(100);
//   t.is(debounced(4), 4);
//   t.is(debounced(5), 4);
//   t.is(debounced(6), 4);
//   t.is(count, 2);
//
//   await delay(200);
//   t.is(count, 2);
// });

// test('before:false after:true options', async (t) => {
//   let count = 0;
//
//   const debounced = debounce(
//     (value) => {
//       count++;
//       return value;
//     },
//     {
//       wait: 20,
//       before: false,
//       after: true,
//     }
//   );
//
//   t.is(debounced(1), undefined);
//   t.is(debounced(2), undefined);
//   t.is(debounced(3), undefined);
//   t.is(count, 0);
//
//   await delay(100);
//   t.is(debounced(4), 3);
//   t.is(debounced(5), 3);
//   t.is(debounced(6), 3);
//   t.is(count, 1);
//
//   await delay(200);
//   t.is(count, 2);
// });
//
// test('before:true after:true options', async (t) => {
//   let count = 0;
//
//   const debounced = debounce(
//     (value) => {
//       count++;
//       return value;
//     },
//     {
//       wait: 20,
//       before: true,
//       after: true,
//     }
//   );
//
//   t.is(debounced(1), 1);
//   t.is(debounced(2), 1);
//   t.is(debounced(3), 1);
//   t.is(count, 1);
//
//   await delay(100);
//   t.is(count, 2);
//   t.is(debounced(4), 4);
//   t.is(debounced(5), 4);
//   t.is(debounced(6), 4);
//   t.is(count, 3);
//
//   await delay(200);
//   t.is(count, 4);
// });
//
// test('.cancel() method', async (t) => {
//   let count = 0;
//
//   const debounced = debounce(
//     (value) => {
//       count++;
//       return value;
//     },
//     {
//       wait: 20,
//     }
//   );
//
//   t.is(debounced(1), undefined);
//   t.is(debounced(2), undefined);
//   t.is(debounced(3), undefined);
//
//   debounced.cancel();
//
//   await delay(100);
//   t.is(debounced(1), undefined);
//   t.is(debounced(2), undefined);
//   t.is(debounced(3), undefined);
//   t.is(count, 0);
// });
//
// test('before:false after:true `maxWait` option', async (t) => {
//   let count = 0;
//
//   const debounced = debounce(
//     (value) => {
//       count++;
//       return value;
//     },
//     {
//       wait: 40,
//       maxWait: 50,
//       after: true,
//       before: false,
//     }
//   );
//
//   t.is(debounced(1), undefined);
//   t.is(count, 0);
//   await delay(30);
//   t.is(count, 0);
//
//   t.is(debounced(2), undefined);
//   t.is(count, 0);
//   await delay(30);
//   t.is(count, 1);
//
//   t.is(debounced(3), 1);
//
//   t.is(count, 1);
//   await delay(200);
//   t.is(count, 2);
// });
//
// test('before:true after:false `maxWait` option', async (t) => {
//   let count = 0;
//
//   const debounced = debounce(
//     (value) => {
//       count++;
//       return value;
//     },
//     {
//       wait: 40,
//       maxWait: 50,
//       after: false,
//       before: true,
//     }
//   );
//
//   t.is(debounced(1), 1);
//   t.is(count, 1);
//   await delay(30);
//
//   t.is(debounced(2), 1);
//   t.is(count, 1);
//   await delay(30);
//   t.is(count, 1);
//
//   t.is(debounced(3), 3);
//   t.is(count, 2);
//
//   await delay(50);
//   t.is(count, 2);
//
//   t.is(debounced(4), 4);
//   t.is(count, 3);
// });
//
// test('before:true after:true `maxWait` option', async (t) => {
//   let count = 0;
//
//   const debounced = debounce(
//     (value) => {
//       count++;
//       return value;
//     },
//     {
//       wait: 40,
//       maxWait: 50,
//       after: true,
//       before: true,
//     }
//   );
//
//   t.is(debounced(1), 1);
//   t.is(count, 1);
//   await delay(30);
//
//   t.is(debounced(2), 1);
//   t.is(count, 1);
//   await delay(30);
//   t.is(count, 2);
//
//   t.is(debounced(3), 3);
//   t.is(count, 3);
//
//   await delay(50);
//   t.is(count, 4);
//
//   t.is(debounced(4), 4);
//   t.is(count, 5);
// });
