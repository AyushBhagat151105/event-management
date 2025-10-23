import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserGuard } from 'src/user/user.guard';
import { CheckInService } from './check-in.service';

@ApiTags('Check-in')
@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @UseGuards(UserGuard)
  @Put(':ticketID')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Check-in successful' })
  @ApiBadRequestResponse({ description: 'Invalid ticket ID' })
  @ApiNotFoundResponse({ description: 'Ticket or Attendee not found' })
  CheckInTicket(@Param('ticketID') ticketID: string) {
    return this.checkInService.updateCheckInStatus(ticketID);
  }
}
