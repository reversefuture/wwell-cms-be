import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateObject<T>(dto: new () => T, body: any): Promise<string[]> {
  const dtoObj = plainToClass(dto, body);
  const errors = await validate(dtoObj as object);
  if (errors.length > 0) {
    const errorMessages = errors.map(error => Object.values(error.constraints ?? {})).flat();
    return errorMessages;
  }

  return [];
}
