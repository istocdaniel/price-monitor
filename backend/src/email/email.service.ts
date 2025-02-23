import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'live.smtp.mailtrap.io', 
      port: 587, 
      secure: false, 
      auth: {
        user: 'api', 
        pass: this.configService.get<string>('SMTP_PW'), 
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'info@demomailtrap.com', 
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}