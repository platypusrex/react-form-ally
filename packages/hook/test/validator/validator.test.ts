import { validator, ValidatorSchema } from '../../src';

type FormValues = {
  foo: string;
  bar: string;
};

describe('validator', () => {
  describe('isRequired', () => {
    it('should validate value for required', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { isRequired: true } };
      const result = validator(schema)({ foo: '', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'foo is required.' } });
    });

    it('should validate value for required with custom message', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { isRequired: { message: 'test' } } };
      const result = validator(schema)({ foo: '', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'test' } });
    });
  });

  describe('isEmail', () => {
    it('should validate value for email', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { isEmail: true } };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'foo is not a valid email address.' } });
    });

    it('should validate value for email with custom message', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { isEmail: { message: 'test' } } };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'test' } });
    });
  });

  describe('isUrl', () => {
    it('should validate value for url', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { isUrl: true } };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'foo is not a valid url.' } });
    });

    it('should validate value for url with custom message', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { isUrl: { message: 'test' } } };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'test' } });
    });
  });

  describe('isOneOf', () => {
    it('should validate value for isOneOf', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { isOneOf: { values: ['foo', 'bar'] } } };
      const result = validator(schema)({ foo: 'bam', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'foo must match one of foo, bar' } });
    });

    it('should validate value for isOneOf with custom message', () => {
      const schema: ValidatorSchema<FormValues> = {
        foo: { isOneOf: { values: ['foo', 'bar'], message: 'test' } },
      };
      const result = validator(schema)({ foo: 'bam', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'test' } });
    });
  });

  describe('max', () => {
    it('should validate value for max', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { max: { length: 2 } } };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'foo must be no more than 2 characters.' } });
    });

    it('should validate value for max with custom message', () => {
      const schema: ValidatorSchema<FormValues> = {
        foo: { max: { length: 2, message: 'test' } },
      };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'test' } });
    });
  });

  describe('min', () => {
    it('should validate value for min', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { min: { length: 4 } } };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'foo must be at least 4 characters.' } });
    });

    it('should validate value for min with custom message', () => {
      const schema: ValidatorSchema<FormValues> = {
        foo: { min: { length: 4, message: 'test' } },
      };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'test' } });
    });
  });

  describe('equals', () => {
    it('should validate value for equals', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { equals: { value: 'bar' } } };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'foo is not equal to bar.' } });
    });

    it('should validate value for equals with custom message', () => {
      const schema: ValidatorSchema<FormValues> = {
        foo: { equals: { value: 'bar', message: 'test' } },
      };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'test' } });
    });
  });

  describe('pattern', () => {
    it('should validate value for pattern', () => {
      const schema: ValidatorSchema<FormValues> = { foo: { pattern: { regex: /boom/ } } };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'foo is not valid.' } });
    });

    it('should validate value for pattern with custom message', () => {
      const schema: ValidatorSchema<FormValues> = {
        foo: { pattern: { regex: /boom/, message: 'test' } },
      };
      const result = validator(schema)({ foo: 'foo', bar: 'bar' });
      expect(result).toEqual({ errors: { foo: 'test' } });
    });
  });
});
