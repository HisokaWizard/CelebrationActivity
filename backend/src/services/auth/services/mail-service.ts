import nodemailer from 'nodemailer';

class MailService {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Activation link for app ' + process.env.SERVER_URL,
      text: '',
      html: `
        <div>
          <h1>Use this link to activate your account!</h1>
          <a href='${link}'>${link}</a>
        </div>
      `,
    });
  }
}

export const mailService = new MailService();
