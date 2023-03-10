import { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { act, renderHook } from '@testing-library/react';
import { useForm, validator } from '../src';

type InitialValues = { foo: string; bar: string };
const initialValues: InitialValues = { foo: 'foo', bar: 'bar' };

describe('useForm', () => {
  describe('initialValues', () => {
    it('should correctly set form values state from initial values provided', () => {
      const { result } = renderHook(() => useForm<InitialValues>({ initialValues }));
      expect(result.current.values).toEqual(initialValues);
    });
  });

  describe('valid', () => {
    it('should validate all form field values on render', () => {
      const { result } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            schema: validator({
              foo: { isEmail: true },
              bar: { isUrl: true },
            }),
          },
        })
      );
      expect(result.current.valid).toEqual(false);
    });

    it('should update valid value anytime a form value is changed', () => {
      const { result, rerender } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            schema: validator({
              foo: { isEmail: true },
            }),
          },
        })
      );
      expect(result.current.valid).toEqual(false);

      const fieldValues = result.current.registerField('foo');
      const eventObj = {
        target: { name: 'foo', value: 'e@e.com' },
      } as ChangeEvent<any>;

      act(() => {
        fieldValues.onChange(eventObj);
      });

      rerender();
      expect(result.current.valid).toEqual(true);
    });
  });

  describe('registerField', () => {
    it('should provide default fields when caller provides field name', () => {
      const { result } = renderHook(() => useForm<InitialValues>({ initialValues }));
      const { onBlur, onChange, value, name } = result.current.registerField('foo');
      expect(onBlur).toBeDefined();
      expect(onChange).toBeDefined();
      expect(value).toEqual('foo');
      expect(name).toEqual('foo');
    });

    it('should provide optional fields when caller provides them', () => {
      const { result } = renderHook(() => useForm<InitialValues>({ initialValues }));
      const fieldOptions = {
        max: 10,
        min: 10,
        maxLength: 5,
        minLength: 5,
        disabled: true,
        pattern: /[a-z][0-9]/,
        id: 'foo',
        placeholder: 'Foo',
        readOnly: true,
        required: true,
      };
      const { onBlur, onChange, value, name, ...rest } = result.current.registerField(
        'foo',
        fieldOptions
      );
      expect(onBlur).toBeDefined();
      expect(onChange).toBeDefined();
      expect(value).toEqual('foo');
      expect(name).toEqual('foo');
      expect(rest).toEqual(fieldOptions);
    });
  });

  describe('onChange', () => {
    it('should update form value state via onChange handler', () => {
      const { result, rerender } = renderHook(() => useForm<InitialValues>({ initialValues }));
      expect(result.current.values).toEqual(initialValues);

      const fieldValues = result.current.registerField('foo');
      const eventObj = {
        target: { name: 'foo', value: 'bar' },
      } as ChangeEvent<any>;

      act(() => {
        fieldValues.onChange(eventObj);
      });

      rerender();
      expect(result.current.values).toEqual({ ...initialValues, foo: 'bar' });
    });

    it('should update form value state and validate field via onChange handler if validation type is change', () => {
      const { result, rerender } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            schema: validator({
              foo: { isEmail: true },
            }),
          },
        })
      );
      expect(result.current.values).toEqual(initialValues);

      const fieldValues = result.current.registerField('foo');
      const eventObj = {
        target: { name: 'foo', value: 'bar' },
      };

      act(() => {
        fieldValues.onChange(eventObj as ChangeEvent<any>);
      });

      rerender();
      expect(result.current.values).toEqual({ ...initialValues, foo: 'bar' });
      expect(Object.keys(result.current.errors)).toHaveLength(1);
      expect(result.current.errors.foo).toBeDefined();
    });

    it('should update form value state and should not validate field via onChange handler if validation type is not change', () => {
      const { result, rerender } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            type: 'blur',
            schema: validator({
              foo: { isEmail: true },
            }),
          },
        })
      );
      expect(result.current.values).toEqual(initialValues);

      const fieldValues = result.current.registerField('foo');
      const eventObj = {
        target: { name: 'foo', value: 'bar' },
      };

      act(() => {
        fieldValues.onChange(eventObj as ChangeEvent<any>);
      });

      rerender();
      expect(result.current.values).toEqual({ ...initialValues, foo: 'bar' });
      expect(Object.keys(result.current.errors)).toHaveLength(0);
      expect(result.current.errors.foo).not.toBeDefined();
    });
  });

  describe('onBlur', () => {
    it('should set form field touched state if the onBlur handler is called', () => {
      const { result, rerender } = renderHook(() => useForm<InitialValues>({ initialValues }));
      expect(result.current.values).toEqual(initialValues);

      const fieldValues = result.current.registerField('foo');
      const eventObj = {
        target: { name: 'foo', value: 'bar' },
      } as FocusEvent<any>;

      act(() => {
        fieldValues.onBlur(eventObj);
      });

      rerender();
      expect(result.current.touched).toEqual({ foo: true });
    });

    it('should update validate form field via onBlur handler if validation type is blur', () => {
      const { result, rerender } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            type: 'blur',
            schema: validator({
              foo: { isEmail: true },
            }),
          },
        })
      );
      expect(result.current.values).toEqual(initialValues);

      const fieldValues = result.current.registerField('foo');
      const eventObj = {
        target: { name: 'foo', value: 'bar' },
      } as FocusEvent<any>;

      act(() => {
        fieldValues.onBlur(eventObj);
      });

      rerender();
      expect(Object.keys(result.current.errors)).toHaveLength(1);
      expect(result.current.errors.foo).toBeDefined();
    });
  });

  describe('onSubmit', () => {
    it('should call prevent default on the form submission event object and call provided submit handler', () => {
      const { result, rerender } = renderHook(() => useForm<InitialValues>({ initialValues }));
      expect(result.current.values).toEqual(initialValues);

      const onSubmit = result.current.onSubmit;
      const submitHandler = jest.fn();
      const formEvent = {
        preventDefault: jest.fn(),
      } as unknown as FormEvent;

      act(() => {
        onSubmit(submitHandler)(formEvent);
      });

      rerender();
      expect(formEvent.preventDefault).toHaveBeenCalled();
      expect(submitHandler).toHaveBeenCalledWith(initialValues);
    });

    it('should update the submitted state to true when the onSubmit handler is called', () => {
      const { result, rerender } = renderHook(() => useForm<InitialValues>({ initialValues }));
      expect(result.current.submitted).toEqual(false);

      const onSubmit = result.current.onSubmit;
      const submitHandler = jest.fn();
      const formEvent = {
        preventDefault: jest.fn(),
      } as unknown as FormEvent;

      act(() => {
        onSubmit(submitHandler)(formEvent);
      });

      rerender();
      expect(result.current.submitted).toEqual(true);
    });

    it('should validate all form values if validation type is submit and submit handler is called', () => {
      const { result, rerender } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            type: 'submit',
            schema: validator({
              foo: { isEmail: true },
              bar: { isUrl: true },
            }),
          },
        })
      );
      expect(result.current.values).toEqual(initialValues);

      const onSubmit = result.current.onSubmit;
      const submitHandler = jest.fn();
      const formEvent = {
        preventDefault: () => ({}),
      } as unknown as FormEvent;

      act(() => {
        onSubmit(submitHandler)(formEvent);
      });

      rerender();
      expect(Object.keys(result.current.errors)).toHaveLength(2);
      expect(result.current.errors.foo).toBeDefined();
      expect(result.current.errors.bar).toBeDefined();
    });
  });

  describe('onReset', () => {
    it('should reset all form state back to the initial state', () => {
      const { result, rerender } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            schema: validator({
              foo: { isEmail: true },
              bar: { isUrl: true },
            }),
          },
        })
      );
      expect(result.current.values).toEqual(initialValues);

      const fieldValues = result.current.registerField('foo');
      const changeEventObj = {
        target: { name: 'foo', value: 'bar' },
      } as ChangeEvent<any>;

      act(() => {
        fieldValues.onChange(changeEventObj);
      });

      rerender();
      expect(result.current.values).toEqual({ ...initialValues, foo: 'bar' });
      expect(Object.keys(result.current.errors)).toHaveLength(1);
      expect(result.current.errors.foo).toBeDefined();

      const blurEventObj = {
        target: { name: 'foo', value: 'bar' },
      } as FocusEvent<any>;

      act(() => {
        fieldValues.onBlur(blurEventObj);
      });

      rerender();
      expect(result.current.values).toEqual({ ...initialValues, foo: 'bar' });
      expect(Object.keys(result.current.errors)).toHaveLength(1);
      expect(result.current.errors.foo).toBeDefined();
      expect(Object.keys(result.current.touched)).toHaveLength(1);
      expect(result.current.touched.foo).toEqual(true);

      act(() => {
        result.current.onReset();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
  });

  describe('setValue and setValues', () => {
    it('should update form value state via setValue handler', () => {
      const { result, rerender } = renderHook(() => useForm<InitialValues>({ initialValues }));
      expect(result.current.values).toEqual(initialValues);

      act(() => {
        result.current.setValue('foo', 'bar');
      });

      rerender();
      expect(result.current.values).toEqual({ ...initialValues, foo: 'bar' });
    });

    it('should validate form value set using setValue handler by default', () => {
      const { result, rerender } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            schema: validator({ foo: { isEmail: true } }),
          },
        })
      );
      expect(result.current.values).toEqual(initialValues);

      act(() => {
        result.current.setValue('foo', 'bar');
      });

      rerender();
      expect(result.current.values).toEqual({ ...initialValues, foo: 'bar' });
      expect(Object.keys(result.current.errors)).toHaveLength(1);
      expect(result.current.errors.foo).toBeDefined();
    });

    it('should update form value state via setValues handler', () => {
      const { result, rerender } = renderHook(() => useForm<InitialValues>({ initialValues }));
      expect(result.current.values).toEqual(initialValues);

      act(() => {
        result.current.setValues({ foo: 'bar', bar: 'foo' });
      });

      rerender();
      expect(result.current.values).toEqual({ foo: 'bar', bar: 'foo' });
    });

    it('should validate form value set using setValues handler by default', () => {
      const { result, rerender } = renderHook(() =>
        useForm<InitialValues>({
          initialValues,
          validation: {
            schema: validator({ foo: { isEmail: true }, bar: { isUrl: true } }),
          },
        })
      );
      expect(result.current.values).toEqual(initialValues);

      act(() => {
        result.current.setValues({ foo: 'bar', bar: 'foo' });
      });

      rerender();
      expect(result.current.values).toEqual({ foo: 'bar', bar: 'foo' });
      expect(Object.keys(result.current.errors)).toHaveLength(2);
      expect(result.current.errors.foo).toBeDefined();
      expect(result.current.errors.bar).toBeDefined();
    });
  });
});
