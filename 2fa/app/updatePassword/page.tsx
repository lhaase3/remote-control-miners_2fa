
'use client';

import { SubmitButton } from './submit-button';
import { useState } from 'react';
import handleUpdatePassword from './action';
import Link from 'next/link';

export default function UpdatePassword({ searchParams }: { searchParams: { message: string, code: string } }) {

  const [error, setError] = useState<string | null>(null);

  // handler for form submission
  const handleSubmit = async (formData: FormData) => {
    setError(null);

    // handle the response from handleUpdatePassword
    const result = await handleUpdatePassword(formData, { message: searchParams.message, code: searchParams.code });
    if(result.error) {
      setError(result.error);
      return;
    }
    // redirect to login page if it was a success
    window.location.href = '/login?message=Your password has been reset successfully';
  };

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
          className="bg-green-700 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Updating..."
        >
          Confirm
        </SubmitButton>
      </form>
    </div>
  );
}

