import type {
  BaseFieldValidation,
  EqualsFieldValidation,
  FieldValidation,
  LengthFieldValidation,
  OneOfFieldValidation,
  PatternFieldValidation,
} from '../types';

export const validators: Record<keyof FieldValidation, Function> = {
  isRequired: (name: string, value: any, config?: BaseFieldValidation) => {
    if (!!value) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is required.`,
    };
  },
  isEmail: (name: string, value: any, config?: BaseFieldValidation) => {
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!value || EMAIL_REGEX.test(value)) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is not a valid email address.`,
    };
  },
  isUrl: (name: string, value: any, config?: BaseFieldValidation) => {
    const URL_REGEX =
      /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if (!value || URL_REGEX.test(value)) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is not a valid url.`,
    };
  },
  isOneOf: (name: string, value: any, config: OneOfFieldValidation) => {
    if (!value || config.values.includes(value)) return;
    return {
      valid: false,
      message: config.message ?? `${name} must match one of ${config.values.join(', ')}`,
    };
  },
  max: (name: string, value: any, config: LengthFieldValidation) => {
    if (!value || value.length <= config.length) return;
    return {
      valid: false,
      message: config?.message ?? `${name} must be no more than ${config.length} characters.`,
    };
  },
  min: (name: string, value: any, config: LengthFieldValidation) => {
    if (!value || value.length >= config.length) return;
    return {
      valid: false,
      message: config?.message ?? `${name} must be at least ${config.length} characters.`,
    };
  },
  equals: (name: string, value: any, config: EqualsFieldValidation) => {
    if (!value || value === config.value) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is not equal to ${config.value}`,
    };
  },
  pattern: (name: string, value: any, config: PatternFieldValidation) => {
    if (!value || !config.regex.test(value)) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is not valid.`,
    };
  },
};
