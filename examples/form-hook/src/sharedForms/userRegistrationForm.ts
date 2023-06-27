import { z } from 'zod';
import { createFormHook } from '@react-form-ally/hook';
import { zodValidator } from '@react-form-ally/zod-validator';

const POBoxRegex = /(P(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box))/i;
const allowedNames = ['Jack', 'Jay', 'Jim', 'Jarod', 'Jason'];

export const schema = z.object({
  name: z
    .string()
    .min(1, 'name is required')
    .refine(
      (val) => allowedNames.some((name) => name === val),
      `name has to match one of the following: ${allowedNames.join(', ')}`
    ),
  website: z.string().url().optional().or(z.literal('')),
  street: z
    .custom((val) => !POBoxRegex.test(val as string), 'No PO box allowed')
    .optional()
    .or(z.literal('')),
  email: z.string().min(1, 'email is required').email(),
  password: z
    .string()
    .min(1, 'password is required')
    .regex(/\b123123\b/, 'password has to match 123123'),
});

export const initialValues = {
  name: '',
  website: '',
  street: '',
  email: '',
  password: '',
};

export type UserRegistrationForm = z.infer<typeof schema>;

export const userRegistrationForm = createFormHook<UserRegistrationForm>({
  input: {
    initialValues,
    type: 'uncontrolled',
  },
  validation: {
    type: 'change',
    debounce: { in: 1000, out: 0 },
    schema: zodValidator(schema),
  },
});
