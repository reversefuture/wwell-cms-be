import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateOTPDto {
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @IsOptional()
  @Matches(/^\+\d{1,3}\d{9,14}$/, {
    message: 'Mobile must be a valid number with country code',
  })
  mobile?: string;
}

