<img src="https://github.com/platypusrex/react-form-ally/blob/master/docs/public/default.svg" data-canonical-src="https://github.com/platypusrex/react-form-ally/blob/master/docs/public/default.svg" width="500" />

Welcome and thanks for checking out `react-form-ally`, a React hook that simplifies form handling in React applications.
`react-form-ally` provides developers with a simple and easy-to-use API to manage form state, validation, and
submission logic. It is highly customizable, and you can configure it to work with any form validation library or
schema. It is also framework-agnostic, and you can use it with any frontend framework or library that supports React.

Overall, this hook helps reduce the amount of boilerplate code generally required for form management in a React
applications, all while improving code quality and maintainability. And of course its also written in TypeScript,
which means not only will you have gained the confidence of the additional type checking, you will also reap the
kind of DX that one should expect from any TS library.

## Installation
**npm**
```bash copy
npm install --save @react-form-ally/hook
```
**yarn**
```bash copy
yarn add @react-form-ally/hook
```
**pnpm**
```bash copy
pnpm add @react-form-ally/hook
```

## Usage
With a familiar and intuitive API, it's super easy to get started with `react-form-ally`. This example will show you
how to get going without the aid of internal or external validators. For more complex examples, see the various examples
showcasing custom validators [here](https://github.com/platypusrex/react-form-ally/tree/master/examples/form-hook).

```tsx filename="Login.tsx"
import { useForm } from '@react-form-ally/hook';

type FormValues = {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

export const Login: React.FC = () => {
  const {
    registerField,
    errors,
    touched,
    valid,
    onSubmit,
    onReset,
  } = useForm<FormValues>({
    initialValues,
    validation: {
      type: 'submit',
      schema: (values) => {
        const errors = {};

        if (!values.email) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = 'Invalid email address';
        }

        if (!values.password) {
          errors.password = 'Password is required';
        } else if (values.password.length < 8) {
          errors.password = 'Password must be at least 8 characters long';
        }

        return { errors };
      },
    },
  });

  const handleSubmit = (formValues: FormValues) => {
    console.log('Submitting form', formValues);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
      <input type="email" {...registerField('email')} />
      {touched.email && errors.email && <div>{errors.email}</div>}

      <input type="password" {...registerField('password')} />
      {touched.password && errors.password && <div>{errors.password}</div>}

      <button type="submit" disabled={!valid}>
        Submit
      </button>
      <button type="reset">
        Reset
      </button>
    </form>
  );
};
```


