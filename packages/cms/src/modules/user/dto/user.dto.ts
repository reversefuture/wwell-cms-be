import {
  IsOptional,
  IsObject,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsIn,
} from 'class-validator';
import { Profiles } from 'common/decorator/roles.decorators';

export class UserDto {
  @IsString()
  id?: string;

  @IsString()
  email: string;

  @IsString()
  credential: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;

  @IsObject()
  @IsOptional()
  profileId?: string;

  @IsOptional()
  @IsString()
  walletKey?: string;

  @IsOptional()
  @IsBoolean()
  termsAccepted?: boolean;

  @IsOptional()
  @IsEnum(Profiles, { each: true })
  roles?: string[];
}

export class UpdateUserDto extends UserDto {
  @IsOptional()
  @IsString()
  email = undefined;
  @IsOptional()
  @IsString()
  password = undefined;
  @IsOptional()
  @IsString()
  id = undefined;

}
