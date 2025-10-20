import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';
import type { Attendee, Event } from '@prisma/client';
type TicketEmailData = Attendee & {
  event: Event;
  ticketCode: string; // Redundant, but useful for clarity
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // 1. Configure the Nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password',
      },
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Error connecting to SMTP server:', error);
      } else {
        this.logger.log('SMTP server is ready to take messages');
      }
    });
  }

  private async generateQrCodeDataUrl(data: string): Promise<string> {
    try {
      // Generate the QR code as a Base64 data URL (image/png)
      const qrDataUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 150,
      });
      return qrDataUrl;
    } catch (err) {
      this.logger.error('Failed to generate QR code:', err);

      return '';
    }
  }

  private createTicketHtml(
    data: TicketEmailData,
    qrCodeDataUrl: string,
  ): string {
    // 3. Create the Beautiful Email HTML Template (Inline CSS for best compatibility)
    const eventDate = data.event.startsAt
      ? new Date(data.event.startsAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Date & Time TBD';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Event Ticket</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; }
              .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .ticket-body { padding: 30px; }
              .ticket-info { margin-bottom: 20px; padding: 15px; border: 1px dashed #ccc; border-radius: 4px; }
              .ticket-info strong { display: block; margin-bottom: 5px; color: #333; }
              .qr-section { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
              .footer { background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Ticket Confirmation</h1>
              </div>
              <div class="ticket-body">
                  <p>Hello <strong>${data.fullName}</strong>,</p>
                  <p>Thank you for registering for the event. Here is your official ticket for <strong>${data.event.title}</strong>.</p>

                  <div class="ticket-info">
                      <strong>EVENT NAME:</strong> ${data.event.title}<br>
                      <strong>DATE & TIME:</strong> ${eventDate}<br>
                      <strong>ATTENDEE:</strong> ${data.fullName}<br>
                      <strong>TICKET CODE:</strong> <code>${data.ticketCode}</code>
                  </div>

                  <p>Please bring this email (digital or print) to the event. The QR code below will be scanned for check-in.</p>

                  <div class="qr-section">
                      <h3>Your Entry QR Code</h3>
                      <img src="${qrCodeDataUrl}" alt="QR Code for Ticket" style="display: block; margin: 10px auto;">
                      <small><strong>Ticket Code:</strong> ${data.ticketCode}</small>
                  </div>
              </div>
              <div class="footer">
                  <p>This is an automated email. Please do not reply.</p>
                  <p>&copy; ${new Date().getFullYear()} Your Company Name</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  async sendTicketEmail(attendee: Attendee, event: Event): Promise<void> {
    if (!attendee.ticketCode) {
      this.logger.error(`Attendee ${attendee.id} is missing a ticketCode.`);
      throw new Error('Ticket code is required to send email.');
    }

    const ticketData: TicketEmailData = {
      ...attendee,
      event,
      ticketCode: attendee.ticketCode,
    };

    // 2. Generate QR Code
    const qrCodeDataUrl = await this.generateQrCodeDataUrl(attendee.ticketCode);

    // 3. Create the HTML email content
    const htmlContent = this.createTicketHtml(ticketData, qrCodeDataUrl);

    // 4. Send the Email
    try {
      const info = await this.transporter.sendMail({
        from: '"Your Event Team" <no-reply@youreventdomain.com>',
        to: attendee.email,
        subject: `Your Ticket for ${event.title}`,
        html: htmlContent,
      });

      this.logger.log(
        `Ticket email sent to ${attendee.email}. Message ID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send ticket email to ${attendee.email}:`,
        error,
      );
      throw new Error('Failed to send email.');
    }
  }
}
