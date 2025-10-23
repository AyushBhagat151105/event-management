import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CheckInService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateCheckInStatus(ticketID: string) {
    const ticket = await this.prismaService.ticket.update({
      where: { id: ticketID },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const attendee = await this.prismaService.attendee.update({
      where: { id: ticket.attendeeId },
      data: { checkedIn: true },
    });

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    return {
      message: 'Check-in successful',
    };
  }
}
