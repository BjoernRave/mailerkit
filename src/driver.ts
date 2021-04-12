import previewEmail from 'preview-email';
import { MailDriver } from './init';

export const previewDriver: MailDriver = {
  send: ({ from, to, ...options }) =>
    previewEmail({
      ...options,
      from: { address: from.email, name: to.name },
      to: { address: to.email, name: to.name },
    }),
};
