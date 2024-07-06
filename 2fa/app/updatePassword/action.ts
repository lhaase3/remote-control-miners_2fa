
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'; 

const handleUpdatePassword = async (formData: FormData, searchParams: { message: string, code: string}) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;
  const supabase = createClient();

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 12) {
    return { error: "Password length must be at least 12 characters" };
  }

  if (password.length > 64) {
    return { error: "Password length must be under 64 characters" };
  }

  if (searchParams.code) {
    const { error }: { error: any } = await supabase.auth.exchangeCodeForSession(searchParams.code);

    if (error) {
      // return redirect(
      //   '/updatePassword?message=Unable to reset password. link expired!'
      // );
      return { error: "Unable to reset password. link expired!" };
    }
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: "Unable to reset password. Try again!" };
  }

  return { data: "Password has been updated!" };
}

export default handleUpdatePassword;



