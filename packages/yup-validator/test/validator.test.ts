import { object, string, InferType } from 'yup';
import { yupValidator } from '../src';

const POBoxRegex = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
const allowedNames = ['Jack', 'Jay', 'Jim', 'Jarod', 'Jason'];

const schema = object({
  name: string()
    .required()
    .test('name match', `name must match one of the following: ${allowedNames.join(', ')}`, (val) =>
      allowedNames.some((name) => name === val)
    ),
  website: string().optional().url(),
  street: string()
    .optional()
    .test('no-po-box', 'P.O. box is not allowed', (value) => !POBoxRegex.test(value!)),
  email: string().email().required(),
  password: string()
    .required()
    .test('password match', 'password must match 123123', (val) => val === '123123'),
});

describe('yupValidator', () => {
  it('should validate a yup schema object and return relevant errors', () => {
    const result = yupValidator<InferType<typeof schema>>(schema)({
      name: 'Frank',
      website: 'foo',
      street: 'PO box',
      email: 'foo',
      password: '',
    });
    expect(result.errors).toEqual({
      email: 'email must be a valid email',
      name: 'name must match one of the following: Jack, Jay, Jim, Jarod, Jason',
      password: 'password is a required field',
      street: 'P.O. box is not allowed',
      website: 'website must be a valid URL',
    });
  });

  it('should validate a zod schema and return empty errors object', () => {
    const result = yupValidator<InferType<typeof schema>>(schema)({
      name: 'Jack',
      website: 'https://foo.com',
      street: '100 Address Dr',
      email: 'foo@email.com',
      password: '123123',
    });
    expect(result.errors).toEqual({});
  });
});
