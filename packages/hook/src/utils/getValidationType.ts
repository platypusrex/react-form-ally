import { Validation } from '../types';

export const getValidationType = (
  validationType: Validation<any>['type']
): Validation<any>['type'] => {
  return !!validationType ? validationType : 'change';
};
