import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private prisma: PrismaService) {}

  // Runs every 1 minute
  @Cron(CronExpression.EVERY_MINUTE)
  async autoCloseEvents() {
    const now = new Date();

    try {
      // Find all active events that have ended
      const eventsToClose = await this.prisma.event.findMany({
        where: {
          isClosed: false,
          endsAt: { lt: now },
        },
      });

      if (eventsToClose.length > 0) {
        // Close them all
        const updatePromises = eventsToClose.map((event) =>
          this.prisma.event.update({
            where: { id: event.id },
            data: { isClosed: true },
          }),
        );

        await Promise.all(updatePromises);

        this.logger.log(
          `✅ Closed ${eventsToClose.length} event(s) automatically`,
        );
      } else {
        this.logger.debug('No events to close at this time.');
      }
    } catch (error) {
      this.logger.error('Error closing events:', error);
    }
  }
}
