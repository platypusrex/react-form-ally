export type FormValues<TValues extends { [key: string]: any }> = {
  [K in keyof TValues]: TValues[K];
};

export type FormErrors<TValues extends FormValues<any>> = {
  [K in keyof TValues]?: string;
};

export type FormTouched<TValues extends FormValues<any>> = {
  [K in keyof TValues]?: boolean;
};
