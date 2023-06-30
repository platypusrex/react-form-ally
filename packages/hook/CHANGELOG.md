# @react-form-ally/hook

## 0.4.0

### Minor Changes

- fb74103: This adds a new utility function for creating form hooks (createFormHook) which is
  instantiated outside of a component's scope. This allows you to persist and share the state of a
  form hook between multiple components without the need of a context provider.

## 0.3.0

### Minor Changes

- 04a69db: The update introduces the `watch` API that can be utilized with the `uncontrolled` input
  strategy. This change allows you to truly adopt a hybrid solution, defaulting all form input to
  uncontrolled, yet allowing individual form fields to behave as controlled inputs. This will allow
  your UI to respond to value changes with specific form fields.

## 0.2.0

### Minor Changes

- 4f17af8: Warning: breaking changes introduced with this release. This is a heavy refactoring of
  the form hook that is intended on improving the overall performance and flexibility of the form
  hook. The `registerField` util has been removed and replace with 3 field registration functions:
  `registerInput`, `registerCheckbox`, and `registerRadio`. A new util was also introduced:
  `focusField`. This supports focusing on any registered form field. The API for useForm has also
  changed slightly. The `initialValues` property is now nested inside an `input` property. You may
  also specify a `type` property for the `input` field of either `controlled` or `uncontrolled`.
  Please the official documentation for more details and examples.

## 0.1.0

### Minor Changes

- 32bf72d: Initial release for all react-form-ally packages. This includes the core hook package and
  zod/yup validator packages.
