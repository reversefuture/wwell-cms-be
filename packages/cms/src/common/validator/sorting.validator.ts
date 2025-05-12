import { registerDecorator, ValidationOptions } from '@nestjs/class-validator';

export function IsSorting(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsSorting',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const sortArray = value.split(',');
          return sortArray.every(
            (item) => item.startsWith('+') || item.startsWith('-'),
          );
        },
      },
    });
  };
}
