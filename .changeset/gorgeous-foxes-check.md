---
'@react-form-ally/hook': minor
---

Warning: breaking changes introduced with this release. This is a heavy refactoring of the form hook
that is intended on improving the overall performance and flexibility of the form hook. The
`registerField` util has been removed and replace with 3 field registration functions: `registerInput`,
`registerCheckbox`, and `registerRadio`. A new util was also introduced: `focusField`. This supports
focusing on any registered form field. The API for useForm has also changed slightly. The
`initialValues` property is now nested inside an `input` property. You may also specify a `type` property
for the `input` field of either `controlled` or `uncontrolled`. Please the official documentation for
more details and examples.
