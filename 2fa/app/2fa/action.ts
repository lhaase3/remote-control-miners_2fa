// 'use server';

// import { createClient } from '@/utils/supabase/server';
// import { redirect } from 'next/navigation';

// // Mock function to send email/SMS
// // async function sendVerificationCode(email: string, code: string) {
// //   // Implement email/SMS sending logic here
// //   console.log(`Sending verification code ${code} to ${email}`);
// // }

// const handleFactorAuth = async (formData: FormData) => {
//   const supabase = createClient();
//   const email = formData.get('email') as string;
//   const verifyCode = formData.get('verifyCode') as string;

//   // Fetch the user's MFA factors
//   // const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
//   // if (factorsError) {
//   //   return { error: factorsError.message };
//   // }

//   // const totpFactor = factors?.totp?.[0];
//   // if (!totpFactor) {
//   //   return { error: 'No TOTP factors found!' };
//   // }

//   const { id: factorId } = totpFactor;

//   // Create a challenge for the TOTP factor
//   const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
//   if (challengeError) {
//     return { error: challengeError.message };
//   }

//   const { id: challengeId } = challenge;

//   // Verify the code
//   const { error: verifyError } = await supabase.auth.mfa.verify({
//     factorId,
//     challengeId,
//     code: verifyCode,
//   });
//   if (verifyError) {
//     return { error: verifyError.message };
//   }

//   // Generate a random verification code
//   const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

//   // Send the code via email/SMS
//   await sendVerificationCode(email, generatedCode);

//   // Redirect to the verification page
//   return redirect('/verify');
// };

// export default handleFactorAuth;
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const handleFactorAuth = async (formData: FormData) => {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const verifyCode = formData.get('verifyCode') as string;

  //formData: FormData, searchParams: { message: string, code: string}

  console.log('Email:', email);
  console.log('Verification code:', verifyCode);

  // Retrieve the saved verification code
  const { data, error } = await supabase
    .from('auth_2fa')
    .select('code')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1);

  console.log('Subapase data:', data);
  console.log('Supabase error:', error);


  if (error || !data || data.length === 0 || data[0].code !== verifyCode) {
    return { error: 'Invalid verification code' };
  }

  // Verification successful
  return redirect('/protected');
};

export default handleFactorAuth;

