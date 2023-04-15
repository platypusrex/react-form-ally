import { InputChangeEvent, NameAndValue } from '../types';

export function getNameAndValueFromSyntheticEvent(e: InputChangeEvent): NameAndValue {
  const { type, name, value, checked, files } = e.target;

  switch (type) {
    case 'number':
      return { name, value: !!value ? Number(value) : value };
    case 'file':
      return { name, value: files };
    case 'checkbox':
      return { name, value: checked };
    default:
      return { name, value };
  }
}
