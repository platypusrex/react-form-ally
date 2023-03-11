import { z } from 'zod';
import { zodValidator } from '../src';

const POBoxRegex = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
const allowedNames = ['Jack', 'Jay', 'Jim', 'Jarod', 'Jason'];

const schema = z.object({
  name: z
    .string()
    .min(1, 'name is required')
    .refine(
      (val) => allowedNames.some((name) => name === val),
      `name has to match one of the following: ${allowedNames.join(', ')}`
    ),
  website: z.string().url().optional().or(z.literal('')),
  street: z
    .custom((val) => !POBoxRegex.test(val as string))
    .optional()
    .or(z.literal('')),
  email: z.string().min(1, 'email is required').email(),
  password: z
    .string()
    .min(1, 'password is required')
    .regex(/123123/, 'password has to match 123123'),
});

describe('zodValidator', () => {
  it('should validate a zod schema object and return relevant errors', () => {
    const result = zodValidator<z.infer<typeof schema>>(schema)({
      name: 'Frank',
      website: 'foo',
      street: 'PO box',
      email: 'foo',
      password: '',
    });
    expect(result.errors).toEqual({
      email: 'Invalid email',
      name: 'name has to match one of the following: Jack, Jay, Jim, Jarod, Jason',
      password: 'password is required',
      street: 'Invalid input',
      website: 'Invalid url',
    });
  });

  it('should validate a zod schema and return empty errors object', () => {
    const result = zodValidator<z.infer<typeof schema>>(schema)({
      name: 'Jack',
      website: 'https://foo.com',
      street: '100 Address Dr',
      email: 'foo@email.com',
      password: '123123',
    });
    expect(result.errors).toEqual({});
  });
});
