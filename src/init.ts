import Mail from 'nodemailer/lib/mailer';
import { compileView } from './compile';
import { previewDriver } from './driver';

const isDev = process.env.NODE_ENV === 'development';

export const initMailer = (options: MailerOptions) => {
  const { driver, layouts, sender } = options;

  if (!sender) throw new Error('Please provide a sender email');

  if (!driver)
    throw new Error('Please provide either a driver or a custom driver');

  if (!layouts || Object.keys(layouts).length === 0)
    throw new Error('Please provide at least one layout');

  const mailDriver = isDev ? previewDriver : driver;

  return {
    send: async ({
      subject,
      to,
      attachments,
      content,
      layout,
    }: {
      subject: string;
      to: { email: string; name: string };
      attachments?: Mail.Attachment[];
      content: Promise<string>;
      layout: string;
    }) => {
      try {
        return await mailDriver.send({
          from: sender,
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

interface Layout {
  [name: string]: string;
}

export interface MailerOptions {
  layouts: Layout;
  sender: { email: string; name: string };
  driver: MailDriver;
}

export type MailDriver = {
  send: (options: {
    from: {
      email: string;
      name: string;
    };
    to: { email: string; name: string };
    subject: string;
    html: string;
    attachments?: Mail.Attachment[];
  }) => Promise<any>;
};
