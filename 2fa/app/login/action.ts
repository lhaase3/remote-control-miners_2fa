// import { createClient } from '@/utils/supabase/server';
// import nodemailer from 'nodemailer';

// const send2FAEmail = async (email: string) => {
//   const supabase = createClient();

//   // Generate a random verification code
//   const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

//   // Save the verification code and timestamp to the user's record or a separate table
//   // Here, we're using a separate table 'auth_2fa'
//   await supabase.from('auth_2fa').insert({
//     email,
//     code: verificationCode,
//     created_at: new Date().toISOString()
//   });

//   // Send the email using nodemailer (replace with your email service provider's API)
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Your 2FA Verification Code',
//     text: `Your verification code is ${verificationCode}`
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default send2FAEmail;

import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

const send2FAEmail = async (email: string) => {
  const supabase = createClient();

  // Generate a random verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save the verification code and timestamp to the user's record or a separate table
  await supabase.from('auth_2fa').insert({
    email,
    code: verificationCode,
    created_at: new Date().toISOString()
  });

  // Configure the email transport using SMTP
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Make sure this matches your .env.local file
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your 2FA Verification Code',
    text: `Your verification code is ${verificationCode}`
  };

  await transporter.sendMail(mailOptions);
};

export default send2FAEmail;

