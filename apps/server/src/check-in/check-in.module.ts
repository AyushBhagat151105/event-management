import { Module } from '@nestjs/common';
import { CheckInController } from './check-in.controller';
import { CheckInService } from './check-in.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CheckInController],
  providers: [CheckInService, PrismaService],
})
export class CheckInModule {}
