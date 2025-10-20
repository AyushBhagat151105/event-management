import { Module } from '@nestjs/common';
import { RegisterEventService } from './register-event.service';
import { RegisterEventController } from './register-event.controller';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [RegisterEventService, PrismaService, EmailService],
  controllers: [RegisterEventController],
})
export class RegisterEventModule {}
