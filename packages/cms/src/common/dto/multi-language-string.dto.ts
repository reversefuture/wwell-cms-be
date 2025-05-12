import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MultiLanguageStringDto {
  @ApiPropertyOptional({ example: 'English' })
  @IsString()
  @IsOptional()
  en?: string;

  @ApiPropertyOptional({ example: 'Thai' })
  @IsString()
  @IsOptional()
  th?: string;

  @ApiPropertyOptional({ example: 'Bahasa (Indonesian)' })
  @IsString()
  @IsOptional()
  in?: string;

  @ApiPropertyOptional({ example: 'Malay (Malaysia)' })
  @IsString()
  @IsOptional()
  ms?: string;

  @ApiPropertyOptional({ example: 'Vietnamese' })
  @IsString()
  @IsOptional()
  vi?: string;

  @ApiPropertyOptional({ example: 'Hindu (Indian)' })
  @IsString()
  @IsOptional()
  hi?: string;

  @ApiPropertyOptional({ example: 'Simplified Chinese' })
  @IsString()
  @IsOptional()
  cn?: string;

  @ApiPropertyOptional({ example: 'Tranditional Chinese' })
  @IsString()
  @IsOptional()
  zh?: string;
}
