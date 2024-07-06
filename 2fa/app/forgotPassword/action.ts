'use server'

import { createClient } from '@/utils/supabase/server'
import { nanoid } from 'nanoid';

const handleForgotPassword = async (formData: FormData) => {
    const supabase = createClient();
    const email = formData.get('email') as string;

    //console.log('hello ghello');
    //console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    //console.log('Redirect URL', redirectTo);

    const { data: existingUser, error: existingUserError } = await supabase
      .from('custom_users')
      .select('*')
      .eq(`email`, email)
      .single();

    //console.log('hello ghello');

      if (existingUserError) {
        if (existingUserError.code === 'PGRST116') { // Check for specific error code
            return { error: "Email entered is not registered." };
        }
        return { error: existingUserError.message };
    }

    if (!existingUser) {
        return { error: "Email entered is not registered." };
    }

    const accessToken = nanoid();
    const refreshToken = nanoid();

    // const resetLink = `http://localhost:3000/updatePassword?access_token=${accessToken}&refresh_token=${refreshToken}`;
    const resetLink = `http://localhost:3000/updatePassword`;

    //console.log(email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/updatePassword`,
        redirectTo: resetLink,
    });

    

    if (error) {
        return { error: error.message };
    }

    //console.log('hello are you working');

    return { message: 'Password reset email sent. Please check your inbox.' };

}

export default handleForgotPassword;