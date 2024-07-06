
// // 'use client';

// import { SubmitButton } from './submit-button';
// //import handleUpdatePassword from './action';
// import Link from 'next/link';
// import { createClient } from '@/utils/supabase/server';
// import { redirect } from 'next/navigation'; 

// export default async function UpdatePassword({ searchParams }: { searchParams: { message: string, code: string } }) {

//   const updatePassword = async (formData: FormData) => {
//     'use server';

//     const password = formData.get("password") as string;
//     const confirmPassword = formData.get("confirm_password") as string;
//     const supabase = createClient();

//     if (searchParams.code) {
//       //const supabase = createClient();
//       const { error }: { error: any } =  await supabase.auth.exchangeCodeForSession(
//         searchParams.code
//       );

//       if (error) {
//         return redirect(
//           '/updatePassword?message=Unable to reset password. link expired!'
//         );
//       }
//     }

//     const { error } = await supabase.auth.updateUser({
//       password,
//     });

//     if (error) {
//       return redirect(
//         '/updatePassword?message=Unable to reset password. try again!'
//       );
//     }

//     redirect(
//       '/login?message=Your password has been reset successfully'
//     );
//   };

'use client';

import { SubmitButton } from './submit-button';
import { useState } from 'react';
import handleUpdatePassword from './action';
import Link from 'next/link';

export default function UpdatePassword({ searchParams }: { searchParams: { message: string, code: string } }) {

  const [error, setError] = useState<string | null>(null);
  //const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await handleUpdatePassword(formData, { message: searchParams.message, code: searchParams.code });
    if(result.error) {
      setError(result.error);
      return;
    }

    window.location.href = '/login?message=Your password has been reset successfully';
  };

  
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);

  //   const result = await handleUpdatePassword(formData, { message: searchParams.message as string, code: searchParams.code as string });

  //   if (result.error) {
  //     setError(result.error ?? null);
  //     setMessage(null);
  //   }
  // };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        {error && <p className="text-red-500">{error}</p>}
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-1"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <label className="text-md" htmlFor="confirm_password">
          Confirm Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-1"
          type="password"
          name="confirm_password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={handleSubmit}
          // formAction={updatePassword}
          className="bg-green-700 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Updating..."
        >
          Update Password
        </SubmitButton>
      </form>
    </div>
  );
}

