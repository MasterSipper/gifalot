import { Injectable } from '@nestjs/common/decorators';
import { readFile } from 'fs/promises';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { resolve } from 'path';

@Injectable()
export class MailService {
  private readonly mailer: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly templates: Record<string, string> = {};

  constructor() {
    this.mailer = createTransport({
      host: 'smtp.simply.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  public async sendResetPassword(email: string, code: string) {
    this.templates['reset-password'] ??= await readFile(
      resolve(__dirname, 'templates/reset-password.html'),
      'utf-8',
    );

    return this.mailer.sendMail({
      from: 'GIFALOT <noreply@gifalot.com>',
      replyTo: 'GIFALOT <noreply@gifalot.com>',
      to: email,
      subject: 'Reset password',
      html: this.templates['reset-password'].replace('{{CODE}}', code),
    });
  }
}
