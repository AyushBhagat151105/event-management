import { Injectable, Logger } from '@nestjs/common';
import { Attendee, Event } from 'generated/prisma';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';

type TicketEmailData = Attendee & {
  event: Event;
  ticketCode: string;
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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Event Ticket</title>
    <style>
      /* RESET */
      body, html {
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #e9eef3;
        padding: 20px;
      }

      .ticket-container {
        max-width: 640px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        border: 1px solid #ddd;
      }

      /* HEADER */
      .ticket-header {
        background: linear-gradient(135deg, #2563eb, #1e40af);
        color: #fff;
        text-align: center;
        padding: 25px 15px;
      }
      .ticket-header h1 {
        margin: 0;
        font-size: 26px;
        letter-spacing: 0.5px;
      }
      .ticket-header p {
        margin: 8px 0 0;
        font-size: 14px;
        opacity: 0.9;
      }

      /* BODY */
      .ticket-body {
        background: #f9fafb;
        border-top: 1px dashed #cbd5e1;
        border-bottom: 1px dashed #cbd5e1;
      }

      .ticket-stub {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        flex-wrap: wrap;
      }

      /* LEFT SECTION */
      .ticket-left {
        flex: 1 1 60%;
        padding: 25px 30px;
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        border-right: 1px dashed #cbd5e1;
        box-sizing: border-box;
      }

      .ticket-left h2 {
        color: #1e293b;
        font-size: 20px;
        margin-bottom: 15px;
      }

      .ticket-detail {
        margin-bottom: 12px;
      }

      .ticket-detail span {
        display: block;
        font-size: 13px;
        color: #64748b;
        margin-bottom: 4px;
      }

      .ticket-detail strong {
        font-size: 15px;
        color: #1e293b;
      }

      .highlight-box {
        margin-top: 18px;
        background: linear-gradient(90deg, #2563eb10, #1e40af10);
        padding: 14px;
        border-radius: 10px;
        text-align: center;
        font-weight: 600;
        color: #1e3a8a;
        letter-spacing: 0.5px;
      }

      /* RIGHT SECTION */
      .ticket-right {
        flex: 1 1 40%;
        background: #f1f5f9;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 25px;
        box-sizing: border-box;
        position: relative;
      }

      .qr-wrapper {
        background: #fff;
        border: 2px dashed #94a3b8;
        border-radius: 12px;
        padding: 12px;
        text-align: center;
      }

      .qr-wrapper img {
        width: 130px;
        height: 130px;
        display: block;
        margin: 0 auto;
      }

      .ticket-code {
        margin-top: 8px;
        font-size: 13px;
        color: #475569;
        word-break: break-all;
      }

      .right-label {
        position: absolute;
        top: 10px;
        right: 0;
        background: #2563eb;
        color: white;
        font-size: 12px;
        padding: 4px 10px;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        letter-spacing: 0.5px;
      }

      /* FOOTER */
      .footer {
        background: #f1f5f9;
        padding: 15px;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
        border-top: 1px solid #e2e8f0;
      }

      /* RESPONSIVE STYLES */
      @media (max-width: 600px) {
        body {
          padding: 10px;
        }

        .ticket-container {
          border-radius: 10px;
        }

        .ticket-header h1 {
          font-size: 20px;
        }

        .ticket-left,
        .ticket-right {
          width: 100%;
          flex: 1 1 100%;
          border-right: none;
          border-bottom: 1px dashed #cbd5e1;
          padding: 20px;
        }

        .ticket-right {
          border-bottom: none;
          padding-top: 10px;
        }

        .qr-wrapper img {
          width: 120px;
          height: 120px;
        }

        .highlight-box {
          font-size: 14px;
        }

        .right-label {
          position: static;
          margin-bottom: 8px;
          border-radius: 6px;
          display: inline-block;
          padding: 4px 8px;
        }
      }

      @media (max-width: 400px) {
        .ticket-left h2 {
          font-size: 18px;
        }

        .ticket-detail strong {
          font-size: 14px;
        }

        .ticket-detail span {
          font-size: 12px;
        }

        .qr-wrapper img {
          width: 100px;
          height: 100px;
        }

        .highlight-box {
          padding: 10px;
          font-size: 13px;
        }
      }
    </style>
  </head>

  <body>
    <div class="ticket-container">
      <!-- HEADER -->
      <div class="ticket-header">
        <h1>${data.event.title}</h1>
        <p>Official Entry Ticket</p>
      </div>

      <!-- BODY -->
      <div class="ticket-body">
        <div class="ticket-stub">
          <!-- LEFT -->
          <div class="ticket-left">
            <h2>Event Pass</h2>
            <div class="ticket-detail">
              <span>Attendee Name</span>
              <strong>${data.fullName}</strong>
            </div>
            <div class="ticket-detail">
              <span>Date & Time</span>
              <strong>${eventDate}</strong>
            </div>
            <div class="ticket-detail">
              <span>Email</span>
              <strong>${data.email}</strong>
            </div>
            <div class="ticket-detail">
              <span>Location</span>
              <strong>${data.event.location}</strong>
            </div>
            <div class="highlight-box">
              🎟 Ticket ID: ${data.ticketCode}
            </div>
          </div>

          <!-- RIGHT -->
          <div class="ticket-right">
            <div class="right-label">SCAN HERE</div>
            <div class="qr-wrapper">
              <img src="${qrCodeDataUrl}" alt="QR Code" />
              <div class="ticket-code">${data.ticketCode}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <p>This is an automated email. Please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
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
