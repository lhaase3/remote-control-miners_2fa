
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const handleFactorAuth = async (formData: FormData) => {
  const supabase = createClient();
  // if user is not logged in and tries to go to register page redirect them to login page
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }
  const email = formData.get('email') as string;
  const verifyCode = formData.get('verifyCode') as string;

  // Retrieve the saved verification code from the database in supabase
  const { data, error } = await supabase
    .from('auth_2fa')
    .select('code')
    .eq('email', email)
    .order('created_at', { ascending: false }) // get the most recent code
    .limit(1);

  // check for errors or if the code entered does not match the code in database
  if (error || !data || data.length === 0 || data[0].code !== verifyCode) {
    return { error: 'Invalid verification code' };
  }

  // Verification successful
  return redirect('/protected');
};

export default handleFactorAuth;

