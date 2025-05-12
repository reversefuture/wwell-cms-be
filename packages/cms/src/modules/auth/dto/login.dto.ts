import { IsOptional, IsObject, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export class LoginDto {
    @IsString()
    email: string;
  
    @IsString()
    password: string;
}
