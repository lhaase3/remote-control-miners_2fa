'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation";

const handleSignUp = async (formData: FormData) => {
    const supabase = createClient()
  // if user is not logged in and tries to go to register page redirect them to login page
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return redirect("/login");
    }
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    // validate phone number length
    if (phone.length < 8) {
      return { error: "Phone number must be at least 8 digits" };
    }

    // password length over 12 characters
    if (password.length < 12) {
      return { error: "Password must be at least 12 characters long" };
    }

    // password length under 64 characters
    if (password.length > 64) {
      return { error: "Password must be less than 64 characters" };
    }

    // checking if password and confirm password match
    if (password !== confirm_password) {
      return { error: "Passwords do not match" };
    }

    // cehck if the user already exists
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


    // Register the user using the Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          phone: phone
        }
      }
    })

    if (error) {
      return { error: error.message };
    }

    // enter in data to custom_users table 
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