import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { EmailModule } from './email/email.module';
import { RegisterEventModule } from './register-event/register-event.module';

@Module({
  imports: [UserModule, EventModule, EmailModule, RegisterEventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
