import SES from 'aws-sdk/clients/ses';
import nodemailer from 'nodemailer';
import previewEmail from 'preview-email';
import { MailDriver } from './init';

export const previewDriver: MailDriver = () => ({
  send: ({ from, ...options }) =>
    previewEmail({
      ...options,
      from: `"${from.name}" ${from.email}`,
    }),
});

export const sesDriver: MailDriver = (options: SES.ClientConfiguration) => {
  const transporter = nodemailer.createTransport({
    SES: new SES(options),
  });

  return {
    send: ({ from, ...options }) =>
      transporter.sendMail({
        ...options,
        from: `"${from.name}" ${from.email}`,
      }),
  };
};
