import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RegisterEventService } from './register-event.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
@ApiTags('Event Registration')
@Controller('register-event')
export class RegisterEventController {
  constructor(private readonly registerEventService: RegisterEventService) {}

  @Post(':eventId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new registration for an event',
    description:
      'Registers an attendee for a specific event, and send registerar user a ticket on thair email.',
  })
  @ApiCreatedResponse({
    description: 'Registration successful',
    schema: {
      example: { message: 'Registration successful' },
    },
  })
  async register(
    @Param('eventId') eventId: string,
    @Body() registerDto: RegisterDto,
  ) {
    return this.registerEventService.registerForEvent(registerDto, eventId);
  }
}
