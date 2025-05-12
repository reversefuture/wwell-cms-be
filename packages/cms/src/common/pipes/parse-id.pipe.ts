import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';
// import { Types } from 'mongoose';
import { apiResponseMessage } from 'modules/shared/response-messages.constant';

export function isValidObjectId(id: string) {
  // if (Types.ObjectId.isValid(id)) {
  //   return String(new Types.ObjectId(id)) === id;
  // }
  // return false;
  return isUUID(id); 
}
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    const validObjectId: boolean = isValidObjectId(value);

    if (validObjectId) {
      return value;
    } else {
      throw new BadRequestException(apiResponseMessage.INVALID_OBJECTID);
    }
  }
}
