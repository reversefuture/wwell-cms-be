import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class MultiLanguageObjectDto {
  @ApiPropertyOptional({ example: 'English' })
  @IsObject()
  @IsOptional()
  en?: object;

  @ApiPropertyOptional({ example: 'Thai' })
  @IsObject()
  @IsOptional()
  th?: object;

  @ApiPropertyOptional({ example: 'Bahasa (Indonesian)' })
  @IsObject()
  @IsOptional()
  in?: object;

  @ApiPropertyOptional({ example: 'Malay (Malaysia)' })
  @IsObject()
  @IsOptional()
  ms?: object;

  @ApiPropertyOptional({ example: 'Vietnamese' })
  @IsObject()
  @IsOptional()
  vi?: object;

  @ApiPropertyOptional({ example: 'Hindu (Indian)' })
  @IsObject()
  @IsOptional()
  hi?: object;

  @ApiPropertyOptional({ example: 'Simplified Chinese' })
  @IsObject()
  @IsOptional()
  cn?: object;

  @ApiPropertyOptional({ example: 'Tranditional Chinese' })
  @IsObject()
  @IsOptional()
  zh?: object;
}
