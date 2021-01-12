import Mail from 'nodemailer/lib/mailer';
import { previewDriver, sesDriver } from './driver';
import { compileView } from './compile';

const isDev = process.env.NODE_ENV === 'development';

const mailDrivers = {
  aws: sesDriver,
};

export type MailDriver = (
  options?: any
) => {
  send: (options: {
    from: {
      email: string;
      name: string;
    };
    to: string;
    subject: string;
    html: string;
    attachments?: Mail.Attachment[];
  }) => Promise<any>;
};

export const initMailer = (options: MailerOptions) => {
  const { driver, layouts, senderEmail, customDriver } = options;

  if (!senderEmail) throw new Error('Please provide a sender email');

  if (!driver && !customDriver)
    throw new Error('Please provide either a driver or a custom driver');

  if (!layouts || Object.keys(layouts).length === 0)
    throw new Error('Please provide at least one layout');

  const mailDriver = isDev
    ? previewDriver()
    : customDriver
    ? customDriver(driver?.options)
    : mailDrivers[driver?.service](driver?.options);

  return {
    send: async ({
      subject,
      to,
      attachments,
      content,
      layout,
    }: {
      subject: string;
      to: string;
      attachments?: Mail.Attachment[];
      content: Promise<string>;
      layout: string;
    }) => {
      try {
        return await mailDriver.send({
          from: {
            email: senderEmail,
            name: process.env.MAIL_FROM_NAME!,
          },
          to,
          subject,
          attachments,
          html: compileView({
            subject,
            content: await content,
            layout: layouts[layout],
          }),
        });
      } catch (e) {
        console.error(e?.response?.body || e);
      }
    },
  };
};

export type MailService = 'aws';

interface Layout {
  [name: string]: string;
}

export interface Driver {
  service: MailService;
  options: any;
}

export interface MailerOptions {
  layouts: Layout;
  senderEmail: string;
  driver: Driver;
  customDriver?: MailDriver;
}
