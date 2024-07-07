'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation";

const handleForgotPassword = async (formData: FormData) => {
    const supabase = createClient();
    // if user is not logged in and tries to go to register page redirect them to login page
    const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) {
        return redirect("/login");
      }
    const email = formData.get('email') as string;

    // check if the email entered exists in the database
    const { data: existingUser, error: existingUserError } = await supabase
      .from('custom_users')
      .select('*')
      .eq(`email`, email)
      .single();

    // handles errors related to checking if the email exists
    if (existingUserError) {
        if (existingUserError.code === 'PGRST116') { // Check for specific error code
            return { error: "Email entered is not registered." };
        }
        return { error: existingUserError.message };
    }

    if (!existingUser) {
        return { error: "Email entered is not registered." };
    }

    // define the reset password link (need to change so it is not localhost)
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const resetLink = `${baseURL}/updatePassword`;

    // send password reset email using supabase's built-in method
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetLink,
    });

    // handle errors related to sending the reset email
    if (error) {
        return { error: error.message };
    }

    return { message: 'Password reset email sent. Please check your inbox.' };
}

export default handleForgotPassword;