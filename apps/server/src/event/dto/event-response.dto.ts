import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Unique event identifier'
  })
  id: string;

  @ApiProperty({ example: 'Summer Music Festival 2025' })
  title: string;

  @ApiProperty({ 
    example: 'https://example.com/banners/summer-fest.jpg',
    description: 'Event banner image URL'
  })
  bannerURL: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the event requires payment for registration'
  })
  requiresPayment: boolean;

  @ApiProperty({ 
    example: 499.99,
    required: false,
    nullable: true,
    description: 'Ticket price (only if requiresPayment is true)'
  })
  amount?: number | null;

  @ApiProperty({ 
    example: [
      { name: 'fullName', type: 'text', required: true, label: 'Full Name' },
      { name: 'phone', type: 'tel', required: true, label: 'Phone Number' },
      { name: 'dietaryRestrictions', type: 'text', required: false, label: 'Dietary Restrictions' }
    ],
    description: 'Dynamic form fields configuration for event registration',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        required: { type: 'boolean' },
        label: { type: 'string' }
      },
      additionalProperties: false
    }
  })
  formFields: any; // JSON type from Prisma

  @ApiProperty({ 
    example: false,
    description: 'Whether event registration is closed'
  })
  isClosed: boolean;

  @ApiProperty({ 
    example: '2025-06-15T10:00:00.000Z',
    required: false,
    nullable: true,
    description: 'Event start date and time'
  })
  startsAt?: Date | null;

  @ApiProperty({ 
    example: '2025-06-15T18:00:00.000Z',
    required: false,
    nullable: true,
    description: 'Event end date and time'
  })
  endsAt?: Date | null;

  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'User ID of event creator'
  })
  createdById: string;

  @ApiProperty({ 
    example: '2025-01-15T10:00:00.000Z',
    description: 'Event creation timestamp'
  })
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-01-20T14:30:00.000Z',
    description: 'Last update timestamp'
  })
  updatedAt: Date;
}

export class PublicEventResponseDto {
  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Unique event identifier'
  })
  id: string;

  @ApiProperty({ example: 'Summer Music Festival 2025' })
  title: string;

  @ApiProperty({ 
    example: 'https://example.com/banners/summer-fest.jpg',
    description: 'Event banner image URL'
  })
  bannerURL: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether the event requires payment for registration'
  })
  requiresPayment: boolean;

  @ApiProperty({ 
    example: 499.99,
    required: false,
    nullable: true,
    description: 'Ticket price (only if requiresPayment is true)'
  })
  amount?: number | null;

  @ApiProperty({ 
    example: [
      { name: 'fullName', type: 'text', required: true, label: 'Full Name' },
      { name: 'phone', type: 'tel', required: true, label: 'Phone Number' },
      { name: 'dietaryRestrictions', type: 'text', required: false, label: 'Dietary Restrictions' }
    ],
    description: 'Dynamic form fields configuration for event registration',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        required: { type: 'boolean' },
        label: { type: 'string' }
      },
      additionalProperties: false
    }
  })
  formFields: any; // JSON type from Prisma

  @ApiProperty({ 
    example: '2025-06-15T10:00:00.000Z',
    required: false,
    nullable: true,
    description: 'Event start date and time'
  })
  startsAt?: Date | null;

  @ApiProperty({ 
    example: '2025-06-15T18:00:00.000Z',
    required: false,
    nullable: true,
    description: 'Event end date and time'
  })
  endsAt?: Date | null;

  @ApiProperty({ 
    example: false,
    description: 'Whether event registration is closed'
  })
  isClosed: boolean;
}

export class MessageResponseDto {
  @ApiProperty({ 
    example: 'Event updated successfully',
    description: 'Success message'
  })
  message: string;
}