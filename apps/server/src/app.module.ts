import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { EmailModule } from './email/email.module';
import { RegisterEventModule } from './register-event/register-event.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { AttendeeModule } from './attendee/attendee.module';
import { CheckInModule } from './check-in/check-in.module';

@Module({
  imports: [UserModule, EventModule, EmailModule, RegisterEventModule, ScheduleModule.forRoot(), CronModule, AttendeeModule, CheckInModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
