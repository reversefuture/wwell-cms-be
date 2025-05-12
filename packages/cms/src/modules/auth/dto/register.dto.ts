import { IsOptional, IsObject, IsString, IsNumber, IsBoolean, IsEnum, IsIn, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @Matches(/^\+\d{1,3}\d{9,14}$/, {
        message: 'Mobile must be a valid number with country code'
    })
    mobile: string;
  
    @MinLength(8)
    @MaxLength(16)
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/, {
        message: 'Password must be 8-16 characters, including alpha-numeric and special characters'
    })
    password: string;

    @MinLength(8)
    @MaxLength(16)
    @Matches(/^[a-zA-Z0-9]+$/, {
        message: 'Username must be 8-16 characters, alpha-numeric characters only'
    })
    username: string;
}