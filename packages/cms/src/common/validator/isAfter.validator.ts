import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from '@nestjs/class-validator';
import { differenceInDays, isAfter } from 'date-fns';

@ValidatorConstraint({ name: 'isAfter' })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    // validate the constraints args
    const isValid = this.handleConstraintsValidation(args);
    if (!isValid) {
      return false;
    }

    const {
      dateConstraint: anotherDateField,
      dateRangeConstraint: diffInDaysConstraint,
    } = this.getDateConstraints(args);

    // date comparison
    const anotherDateValue = args.object[anotherDateField];
    const date = new Date(propertyValue);
    const anotherDate = new Date(anotherDateValue);
    const diffInDays = differenceInDays(date, anotherDate);
    const isDateRangeMatched = diffInDaysConstraint === diffInDays;

    console.log('date', date);
    console.log('anotherDate', anotherDate);
    console.log('diffInDays', diffInDays);

    return isAfter(date, anotherDate) && isDateRangeMatched;
  }

  defaultMessage(args: ValidationArguments) {
    const isValid = this.handleConstraintsValidation(args);
    if (!isValid) {
      return `${args.property} constraints is invalid`;
    }
    const {
      dateConstraint: dateToCompare,
      dateRangeConstraint: dayConstraints,
    } = this.getDateConstraints(args);
    return `${args.property} must be after ${dateToCompare} for ${dayConstraints} days`;
  }

  handleConstraintsValidation(args: ValidationArguments) {
    if (!Array.isArray(args.constraints)) {
      return false;
    }
    const {
      dateConstraint: dateToCompare,
      dateRangeConstraint: dayConstraints,
    } = this.getDateConstraints(args);
    if (
      typeof dateToCompare !== 'string' ||
      typeof dayConstraints !== 'number'
    ) {
      return false;
    }
    return true;
  }

  getDateConstraints(args: ValidationArguments) {
    return {
      dateConstraint: args.constraints[0],
      dateRangeConstraint: args.constraints[1],
    };
  }
}
