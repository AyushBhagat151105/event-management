import { Module } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AttendeeService, PrismaService],
  controllers: [AttendeeController],
})
export class AttendeeModule {}
