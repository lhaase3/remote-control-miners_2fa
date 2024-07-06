'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import handleFactorAuth from './action';
import { SubmitButton } from './submit-button';
import { useSearchParams } from 'next/navigation';

export default function Verify() {
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      const emailParam = searchParams.get('email');
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if(!email) {
      setError('No email found');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('email',email);

    const result = await handleFactorAuth(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Verification successful!');
      // Redirect to the protected page
      window.location.href = '/protected';
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/login"
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
        </svg>{" "}
        Back
      </Link>
      <form onSubmit={handleSubmit} className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label>Please enter the code sent to your email.</label>
        {error && <div className="error text-red-500">{error}</div>}
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="text"
          name="verifyCode"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.trim())}
          placeholder="Verification Code"
          required
        />
        <SubmitButton
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Verifying..."
        >
          Verify
        </SubmitButton>
        {message && <p className="mt-4 p-4 bg-green-100 text-green-700 text-center">{message}</p>}
      </form>
      {searchParams?.message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {searchParams.message}
        </p>
      )}
    </div>
  );
}
