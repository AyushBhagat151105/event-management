import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { PaymentStatus } from '@prisma/client';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class RegisterEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async registerForEvent(registerDto: RegisterDto, eventId: string) {
    const { fullName, email, formResponses, paymentStatus } = registerDto;

    const existingRegistration = await this.prisma.attendee.findFirst({
      where: { email: email, eventId: eventId },
    });

    if (existingRegistration) {
      throw new ConflictException(
        'You have already registered for this event.',
      );
    }
    const attendee = await this.prisma.attendee.create({
      data: {
        fullName: fullName,
        email: email,
        eventId: eventId,
        formResponses: formResponses,
        paymentStatus:
          (paymentStatus as unknown as PaymentStatus) || PaymentStatus.PENDING,
      },
    });

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        attendeeId: attendee.id,
        checkedIn: false,
        issuedAt: new Date().toISOString(),
      },
    });

    await this.emailService.sendTicketEmail(attendee, event, ticket);

    return {
      message: 'Registration successful',
    };
  }
}
