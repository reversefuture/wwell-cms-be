import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from '@nestjs/class-validator';
import { apiResponseMessage } from 'modules/shared/response-messages.constant';
import { isValidObjectId } from '../pipes/parse-id.pipe';

@ValidatorConstraint({ name: 'isObjectId' })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return isValidObjectId(propertyValue);
  }

  defaultMessage(args: ValidationArguments) {
    return apiResponseMessage.INVALID_OBJECTID.replace('.', '');
  }
}
