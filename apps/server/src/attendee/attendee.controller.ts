import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AttendeeResponseDto } from './dto/attendee-response.dto';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { UserGuard } from 'src/user/user.guard';

@ApiTags('Attendee')
@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Attendee by event ID',
    description: 'Retrieves attendee details for a specific event by its ID',
  })
  @ApiOkResponse({
    description: 'List of attendees for the given event ID',
    type: AttendeeResponseDto,
    isArray: true,
  })
  getAttendee(@Param('id') eventId: string) {
    return this.attendeeService.getAttendeeById(eventId);
  }
}
