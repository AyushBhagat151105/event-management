import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  bannerURL: string;

  @IsNotEmpty()
  @IsBoolean()
  requiresPayment: boolean;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  formFields: object[];

  @IsNotEmpty()
  @IsBoolean()
  isClosed: boolean;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startsAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endsAt: Date;
}
