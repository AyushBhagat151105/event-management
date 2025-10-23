import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AttendeeService {
  constructor(private readonly prismaService: PrismaService) {}
  getAttendeeById(eventId: string) {
    const attendee = this.prismaService.attendee.findMany({
      where: { eventId: eventId },
    });

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    return attendee;
  }
}
