import { FormValues } from '../types';

export const updateUncontrolledField = <TValues extends FormValues<any>>(
  fieldRefs: Record<keyof TValues, HTMLInputElement>,
  name: keyof TValues,
  value: any
) => {
  const fieldRef = fieldRefs[name];
  switch (fieldRef.type) {
    case 'checkbox':
      fieldRef.checked = value;
      break;
    case 'radio':
      fieldRef.checked = value === fieldRef.value;
      break;
    default:
      fieldRef.value = value;
      break;
  }
};
