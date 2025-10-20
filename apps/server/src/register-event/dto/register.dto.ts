import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the attendee',
    example: 'Ayush Bhagat',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Email of the attendee (unique per event)',
    example: 'ayush@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Form responses filled by the attendee (dynamic fields)',
    example: {
      department: 'Computer Science',
      year: 'Final Year',
      gender: 'Male',
    },
  })
  @IsObject()
  @IsNotEmpty()
  formResponses: Record<string, any>;

  @ApiProperty({
    description: 'Payment status (optional, defaults to PENDING)',
    example: 'PENDING',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentStatus?: string;
}
