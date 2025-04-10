import axios from 'axios';
import ApiError from '../errors/ApiError';
import { logger } from './logger';
import config from '../config';

const API_KEY = config.mail_gun;

interface EmailValues {
  name?: string;
  email?: any;
  otp?: number;
}

export const sendOtpEmail = async ({ name, email, otp }: EmailValues) => {
  try {
    const response = await axios.post(
      'https://api.mailersend.com/v1/email',
      {
        from: {
          email: config.mail_gun_domain,
          name: 'HolyBot-AI',
        },
        to: [
          {
            email,
            name,
          },
        ],
        subject: 'Your One-Time Password (OTP)',
        text: `Hello ${name}, your OTP is: ${otp}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto;">
              <div style="background-color: #f9f9f9; border-radius: 10px; padding: 30px; border: 1px solid #e0e0e0;">
                <h2 style="color: #2c3e50;">Hi ${name},</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                  Thank you for choosing <strong>HolyBot-AI</strong>. To proceed, please use the One-Time Password (OTP) provided below:
                </p>
                <div style="margin: 30px 0; text-align: center;">
                  <span style="font-size: 24px; font-weight: bold; color: #2c3e50; background: #eef2f7; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                    ${otp}
                  </span>
                </div>
                <p style="font-size: 14px; color: #777;">
                  This OTP is valid for the next 10 minutes. Do not share this code with anyone.
                </p>
                <p style="font-size: 14px; margin-top: 40px;">
                  Best regards,<br/>
                  <strong>HolyBot-AI Team</strong>
                </p>
              </div>
              <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                &copy; ${new Date().getFullYear()} HolyBot-AI. All rights reserved.
              </footer>
            </div>
          `,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    logger.info('OTP Email sent:', response.data);
  } catch (error) {
    throw new ApiError(500, 'Failed to send OTP email', error as any);
  }
};
