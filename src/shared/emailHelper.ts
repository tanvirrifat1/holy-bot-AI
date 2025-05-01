// import nodemailer from 'nodemailer';
// import config from '../config';
// import { errorLogger, logger } from '../shared/logger';
// import { ISendEmail } from '../types/email';

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: config.email.user,
//     pass: config.email.pass,
//   },
// });

// const sendEmail = async (values: ISendEmail) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"HOLY-BOT-AI" ${config.email.from}`,
//       to: values.to,
//       subject: values.subject,
//       html: values.html,
//     });

//     logger.info('Mail send successfully', info.accepted);
//   } catch (error) {
//     errorLogger.error('Email', error);
//   }
// };

// export const emailHelper = {
//   sendEmail,
// };

import config from '../config';
import { logger } from '../shared/logger';
import { ISendEmail } from '../types/email';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  config.oauth.cid,
  config.oauth.pass,
  'https://developers.google.com/oauthplayground', // Redirect URI
);

oAuth2Client.setCredentials({
  refresh_token: config.oauth.token,
});

const sendEmail = async (values: ISendEmail) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const emailLines = [
      `From: "HOLY-BOT-AI" ${config.email.from}`,
      `To: ${values.to}`,
      `Subject: ${values.subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      values.html,
    ];

    const encodedEmail = Buffer.from(emailLines.join('\n'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedEmail },
    });

    logger.info('Mail send successfully', res.status);
  } catch (error) {
    logger.error('Email', error);
  }
};

export const emailHelper = {
  sendEmail,
};
