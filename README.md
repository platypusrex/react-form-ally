<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/public/default-dark.svg">
  <img src="./docs/public/default.svg" width="500" alt="react-form-ally logo">
</picture>

Welcome and thanks for checking out `react-form-ally`, a React hook that simplifies form handling in React applications.
`react-form-ally` provides developers with a simple and easy-to-use API to manage form state, validation, and
submission logic. It is highly customizable, and you can configure it to work with any form validation library or
schema. It is also framework-agnostic, and you can use it with any frontend framework or library that supports React.

Flexibility is the main ingredient in `react-form-ally`. The API allows developers to truly choose the exact strategy
necessary for the requirements of building any given form. With user input, you can choose between `controlled` and
`uncontrolled` strategies, allowing you to reduce the amount of rerendering that tracking input change might induce.

Aside from providing a clear, concise, and granular ways to manage form input state, `react-form-ally` also provides
a flexible way to handle form validation. Validation can be performed on `change`, `blur`, or `submit`, and the hook
supports debouncing validation to reduce performance overhead. This means you can track errors on change if required,
but ignore rerendering on every keypress. This can seriously improve the overall performance of the form which general
equates to a better experience for your end users.

The module itself provides some built it validation, but also ultimately supports a plugin style validation. This
allows you to roll your own validation for your particular use case, or you can install one of the companion modules
for using third-party validation libraries. Currently this includes both [Zod](https://zod.dev) and
[Yup](https://github.com/jquense/yup).

Overall, this hook helps reduce the amount of boilerplate code generally required for form management in a React
applications, all while improving code quality, maintainability, and performance. And of course its also written in
TypeScript, which means not only will you have gained the confidence of the additional type checking, you will also
reap the kind of DX that one should expect from any TS library.

**Full documentation [here](https://react-form-ally-docs.vercel.app/)**

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
    registerInput,
    errors,
    touched,
    valid,
    onSubmit,
    onReset,
  } = useForm<FormValues>({
    input: {
      initialValues,
      type: 'uncontrolled', // uncontrolled is the default input type
    },
    validation: {
      type: 'change', // change is the default validation type
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
      <input {...registerInput('email', { type: 'email' })} />
      {touched.email && errors.email && <div>{errors.email}</div>}

      <input {...registerInput('password', { type: 'password' })} />
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

### Contributors
This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## LICENSE
MIT
