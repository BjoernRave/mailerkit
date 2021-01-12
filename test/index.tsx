import { EmailWrapper, initMailer, renderEmail } from '../src';
import React from 'react';

const renderTestEmail = (name: string) =>
  renderEmail(
    <EmailWrapper title="Test email">
      <p>hello from {name}</p>
    </EmailWrapper>
  );

export const sendTestMail = () => {
  const mail = initMailer({
    driver: { service: 'aws', options: {} as any },
    layouts: { default: 'test/testLayout.html' },
    senderEmail: 'info@inventhora.com',
  });

  mail.send({
    to: 'test@inventhora.com',
    content: renderTestEmail('Pieter'),
    layout: 'default',
    subject: 'This is a test',
  });
};

sendTestMail();
