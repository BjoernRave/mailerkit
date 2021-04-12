import inlineCSS from 'inline-css';
import React, { ReactNode } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Email } from 'react-html-email';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export const renderEmail = async (emailComponent: ReactNode) => {
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';

  const sheet = new ServerStyleSheet();

  const html = ReactDOMServer.renderToStaticMarkup(
    <StyleSheetManager sheet={sheet.instance}>
      {emailComponent}
    </StyleSheetManager>
  );

  const styleTag = sheet.getStyleTags();

  const cleanedStyles =
    styleTag ===
    '<style data-styled="true" data-styled-version="5.2.3"></style>'
      ? ''
      : styleTag;

  const inlinedHtml = await inlineCSS(doctype + cleanedStyles + html, {
    url: 'noUrl',
  });

  return inlinedHtml;
};

export const EmailWrapper = ({ title, children }) => (
  <Email title={title}>
    <h1>{title}</h1>
    {children}
  </Email>
);

export const Space = ({ pixel }: { pixel: string }) => (
  <tr>
    <td colSpan={3} height={pixel}></td>
  </tr>
);
