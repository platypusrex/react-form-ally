import { InputChangeEvent, NameAndValue, OnChangeEvent } from '../types';
import { getNameAndValueFromSyntheticEvent } from './getNameAndValueFromSyntheticEvent';

export const getInputNameAndValue = (e: OnChangeEvent): NameAndValue => {
  if (e && Reflect.has(e, 'target')) {
    return getNameAndValueFromSyntheticEvent(e as InputChangeEvent);
  }

  return { ...(e as NameAndValue) };
};
