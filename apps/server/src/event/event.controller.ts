import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  EventResponseDto,
  PublicEventResponseDto,
  MessageResponseDto,
} from './dto/event-response.dto';
import { UserGuard } from 'src/user/user.guard';
import type { AuthenticatedRequest } from 'src/types/authenticated-request.interface.ts';

@ApiTags('Events')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new event',
    description:
      'Creates a new event with the authenticated user as the creator',
  })
  @ApiCreatedResponse({
    description: 'Event created successfully',
    type: EventResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or failed to create event',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  create(
    @Body() createEventDto: CreateEventDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.eventService.create(createEventDto, req);
  }

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'Get all events created by user',
    description:
      'Returns a list of all events created by the authenticated user, ordered by creation date (newest first)',
  })
  @ApiOkResponse({
    description: 'List of events retrieved successfully',
    type: [EventResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'Failed to fetch events',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.eventService.findAll(req);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get public event details',
    description:
      'Returns public event information for attendee registration (does not require authentication)',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: 'Event details retrieved successfully',
    type: PublicEventResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid event ID or failed to fetch event',
  })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an event',
    description:
      'Updates an event. Only the event creator can update their own events',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: 'Event updated successfully',
    type: MessageResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Event not found or user is not the creator',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or failed to update event',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.eventService.update(id, updateEventDto, req);
  }

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an event',
    description:
      'Deletes an event and all associated attendees. Only the event creator can delete their own events',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiOkResponse({
    description: 'Event deleted successfully',
    type: MessageResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Event not found or user is not the creator',
  })
  @ApiBadRequestResponse({
    description: 'Failed to delete event',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.eventService.remove(id, req);
  }
}
