import {
  ValidationOptions,
  isMimeType,
  registerDecorator,
} from 'class-validator';

export function isSupportedMimeType(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          if (typeof value !== 'string' || !isMimeType(value)) {
            return false;
          }

          return value.startsWith('image/') || value.startsWith('video/');
        },
        defaultMessage() {
          return 'mimeType is not valid';
        },
      },
    });
  };
}
