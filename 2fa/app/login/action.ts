
import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';
import { redirect } from "next/navigation";

const send2FAEmail = async (email: string) => {
  const supabase = createClient();
  // if user is not logged in and tries to go to register page redirect them to login page
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Generate a random verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save the verification code and timestamp to the 'auth_2fa' table
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
      pass: process.env.EMAIL_PASS
    }
  });

  // what the user will see from the email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your 2FA Verification Code',
    text: `Your verification code is ${verificationCode}`
  };

  await transporter.sendMail(mailOptions);
};

export default send2FAEmail;

