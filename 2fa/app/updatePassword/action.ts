
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'; 

const handleUpdatePassword = async (formData: FormData, searchParams: { message: string, code: string}) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;
  const supabase = createClient();
// if user is not logged in and tries to go to register page redirect them to login page
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // validate password confirmation
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 12) {
    return { error: "Password length must be at least 12 characters" };
  }

  if (password.length > 64) {
    return { error: "Password length must be under 64 characters" };
  }

  // exchange the reset code for a session if a code is provided using Supabase built in function
  if (searchParams.code) {
    const { error }: { error: any } = await supabase.auth.exchangeCodeForSession(searchParams.code);

    if (error) {
      return { error: "Unable to reset password. link expired!" };
    }
  }

  // updtae the user's password with Supabase built in function
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: "Unable to reset password. Try again!" };
  }

  return { data: "Password has been updated!" };
}

export default handleUpdatePassword;



