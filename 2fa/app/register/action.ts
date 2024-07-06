'use server'

import { createClient } from '@/utils/supabase/server'

const handleSignUp = async (formData: FormData) => {
    const supabase = createClient()

    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    //console.log("form data: ", { email, number, password, confirm_password });

    if (phone.length < 8) {
        //console.log("it failed");
      return { error: "Phone number must be at least 8 digits" };
    }

    //console.log("hello");

    if (password.length < 12) {
      return { error: "Password must be at least 12 characters long" };
    }

    if (password.length > 64) {
      return { error: "Password must be less than 64 characters" };
    }

    if (password !== confirm_password) {
      return { error: "Passwords do not match" };
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from('custom_users')
      .select('*')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingUser) {
      return { error: "user already exists with the provided email or phone number."};
    }

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      return { error: existingUserError.message };
    }


    // PR: should be using the upabase.auth.signUp
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          phone: phone
        }
      }
    })

    console.log("supabase response:", { data, error });

    if (error) {
      return { error: error.message };
    }

    const { error: insertError } = await supabase.from('custom_users').insert({
      email,
      phone,
      created_at: new Date().toISOString()
    })

    if (insertError) {
      return { error: insertError.message };
    }

    return { data: 'Sign up successful. Please check your email to confirm your account.'}
  }

  export default handleSignUp;