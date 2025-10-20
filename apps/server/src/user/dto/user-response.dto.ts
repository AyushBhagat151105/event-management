import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMWIyYzNkNC1lNWY2LTc4OTAtYWJjZC1lZjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzI5NDI1NjAwLCJleHAiOjE3Mjk1MTIwMDB9.dGhpc19pc19hX2Zha2VfdG9rZW5fZm9yX2V4YW1wbGU',
    description: 'JWT access token for authentication',
  })
  access_token: string;
}

export class UserProfileResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Unique user identifier',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'https://example.com/avatars/johndoe.jpg',
    required: false,
    nullable: true,
    description: 'User avatar image URL',
  })
  avatar?: string | null;

  @ApiProperty({
    example: '2025-01-15T10:00:00.000Z',
    description: 'Account creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-20T14:30:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Logout successful',
    description: 'Success message',
  })
  message: string;
}
