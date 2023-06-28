import { ChangeEvent } from 'react';
import { act, renderHook } from '@testing-library/react';
import { createFormHook, validator } from '../src';

type InitialValues = { foo: string; bar: string };
const initialValues: InitialValues = { foo: 'foo', bar: 'bar' };

describe('createFormHook', () => {
  it('should retain default state between different references of the createFormHook instance', () => {
    const useForm = createFormHook({
      input: { initialValues },
      validation: {
        schema: validator({
          foo: { isEmail: true },
          bar: { isUrl: true },
        }),
      },
    });

    const { result: resOne } = renderHook(() => useForm());
    const { result: resTwo } = renderHook(() => useForm());

    expect(resOne.current.values).toStrictEqual(resTwo.current.values);
    expect(resOne.current.errors).toStrictEqual(resTwo.current.errors);
    expect(resOne.current.submitted).toStrictEqual(resTwo.current.submitted);
    expect(resOne.current.touched).toStrictEqual(resTwo.current.touched);
    expect(resOne.current.valid).toStrictEqual(resTwo.current.valid);
  });

  it('should retain value state updates between separate references of the same createFormHook instance', () => {
    const useForm = createFormHook({
      input: { initialValues },
      validation: {
        schema: validator({
          foo: { isEmail: true },
          bar: { isUrl: true },
        }),
      },
    });

    const { result: resOne, rerender: rerenderOne } = renderHook(() => useForm());
    const { result: resTwo, rerender: rerenderTwo } = renderHook(() => useForm());

    expect(resOne.current.values).toStrictEqual(resTwo.current.values);

    const fieldValues = resOne.current.registerInput('foo');
    const eventObj = {
      target: { name: 'foo', value: 'e@e.com' },
    } as ChangeEvent<any>;

    act(() => {
      fieldValues.onChange(eventObj);
    });

    rerenderOne();
    rerenderTwo();
    expect(resOne.current.values.foo).toEqual('e@e.com');
    expect(resTwo.current.values.foo).toEqual('e@e.com');
  });

  it('should retain error state updates between separate references of the same createFormHook instance', () => {
    const useForm = createFormHook({
      input: { initialValues },
      validation: {
        schema: validator({
          foo: { isEmail: true },
          bar: { isUrl: true },
        }),
      },
    });

    const { result: resOne, rerender: rerenderOne } = renderHook(() => useForm());
    const { result: resTwo, rerender: rerenderTwo } = renderHook(() => useForm());

    expect(resOne.current.values).toStrictEqual(resTwo.current.values);

    const fieldValues = resOne.current.registerInput('foo');
    const eventObj = {
      target: { name: 'foo', value: 'bar' },
    } as ChangeEvent<any>;

    act(() => {
      fieldValues.onChange(eventObj);
    });

    rerenderOne();
    rerenderTwo();
    expect(resOne.current.errors.foo).toEqual('foo is not a valid email address.');
    expect(resOne.current.valid).toBeFalsy();
    expect(resTwo.current.errors.foo).toEqual('foo is not a valid email address.');
    expect(resTwo.current.valid).toBeFalsy();
  });
});
