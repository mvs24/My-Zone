export const isEmailValid = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isRequiredValidationCompleted = (str: string) => str?.length > 0;

export const isMinimumLengthValidationCompleted = (
  str: string,
  minLength: number
) => str?.length >= minLength;
