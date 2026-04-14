import * as nodemailer from 'nodemailer';
import { EmailSender } from '@/application/protocols/messaging';

export class NodemailerEmailSender implements EmailSender {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILING_HOST || 'localhost',
      port: Number(process.env.MAILING_PORT || 1025),
      secure: false,
    });
  }

  async send(params: EmailSender.Params): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.MAILING_FROM || 'noreply@autorepair.local',
      to: params.to,
      subject: params.subject,
      text: params.body,
    });
  }
}
