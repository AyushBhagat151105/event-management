import { ApiProperty } from '@nestjs/swagger';

class FormResponsesDto {
  @ApiProperty({
    example: '7777777777',
    description: 'Phone number of the attendee',
  })
  phone: string;
}

export class AttendeeResponseDto {
  @ApiProperty({
    example: 'a587e365-9da1-4374-8c2c-c15dd43225c9',
    description: 'Unique identifier of the attendee',
  })
  id: string;

  @ApiProperty({
    example: '4677a337-6532-4c8a-9855-d38e310479c1',
    description: 'Event ID associated with this attendee',
  })
  eventId: string;

  @ApiProperty({
    example: 'Ayush Bhagat',
    description: 'Full name of the attendee',
  })
  fullName: string;

  @ApiProperty({
    example: 'ayush@example.com',
    description: 'Email of the attendee',
  })
  email: string;

  @ApiProperty({
    type: FormResponsesDto,
    description: 'Additional form responses submitted by the attendee',
  })
  formResponses: FormResponsesDto;

  @ApiProperty({
    example: 'PENDING',
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    description: 'Current payment status of the attendee',
  })
  paymentStatus: string;

  @ApiProperty({
    example: '96a5711e-f758-458c-9cf1-d7f284a6440b',
    description: 'Unique ticket code for verification',
  })
  ticketCode: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the attendee has checked in',
  })
  checkedIn: boolean;

  @ApiProperty({
    example: '2025-10-20T15:30:20.111Z',
    description: 'Timestamp when the attendee record was created',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-10-20T15:30:20.111Z',
    description: 'Timestamp when the attendee record was last updated',
  })
  updatedAt: string;
}
