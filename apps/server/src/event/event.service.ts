import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import type { AuthenticatedRequest } from 'src/types/authenticated-request.interface.ts';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, req: AuthenticatedRequest) {
    try {
      const userId = req.user.sub;

      const event = await this.prisma.event.create({
        data: {
          ...createEventDto,
          createdById: userId,
        },
      });

      return event;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create event');
    }
  }

  async findAll(req: AuthenticatedRequest) {
    try {
      const userId = req.user.sub;

      const events = await this.prisma.event.findMany({
        where: { createdById: userId },
        orderBy: { createdAt: 'desc' },
      });

      return events;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch events');
    }
  }

  async findOne(id: string) {
    try {
      // Fetch only public fields for attendees
      const event = await this.prisma.event.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          bannerURL: true,
          requiresPayment: true,
          amount: true,
          formFields: true,
          startsAt: true,
          endsAt: true,
          isClosed: true,
        },
      });

      if (!event) throw new NotFoundException('Event not found');

      return event;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch event');
    }
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    req: AuthenticatedRequest,
  ) {
    try {
      const userId = req.user.sub;

      const event = await this.prisma.event.updateMany({
        where: { id, createdById: userId },
        data: updateEventDto,
      });

      if (event.count === 0) throw new NotFoundException('Event not found');

      return { message: 'Event updated successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update event');
    }
  }

  async remove(id: string, req: AuthenticatedRequest) {
    try {
      const userId = req.user.sub;

      const deleted = await this.prisma.event.deleteMany({
        where: { id, createdById: userId },
      });

      if (deleted.count === 0) throw new NotFoundException('Event not found');

      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete event');
    }
  }
}
