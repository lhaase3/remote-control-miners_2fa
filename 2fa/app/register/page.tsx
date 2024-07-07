
'use client';

import { useState } from 'react';
import Link from 'next/link';
import handleSignUp from './action';
import { SubmitButton } from './submit-button';

export default function Register({ searchParams }: { searchParams: { message: string } }) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Call the handleSignUp function to handle user registration 
    const result = await handleSignUp(formData);

    if (result.error) {
      setError(result.error ?? null);
      setMessage(null);
    } else {
      setMessage(result.data ?? null);
      setError(null);
    }
  };

  return (
    <div className='flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2'>
      <Link
        href='/login'
        className='absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1'
        >
          <polyline points='15 18 9 12 15 6' />
        </svg>{' '}
        Back
      </Link>
      <form onSubmit={handleSubmit} className='animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground'>
        <label className='text-md' htmlFor='email'>
          Email
        </label>
        <input
          className='rounded-md px-4 py-2 bg-inherit border mb-6'
          name='email'
          placeholder='you@example.com'
          aria-label='Email'
          required
        />
        <label className='text-md'>Phone Number</label>
        <input
          className='rounded-md px-4 py-2 bg-inherit border mb-6'
          name='phone'
          placeholder='+1 (XXX) XXX-XXXX'
          aria-label='Phone Number'
          required
        />
        <label className='text-md' htmlFor='password'>
          Password
        </label>
        <input
          className='rounded-md px-4 py-2 bg-inherit border mb-6'
          type='password'
          name='password'
          placeholder='••••••••'
          aria-label='Password'
          required
        />
        <label className='text-md' htmlFor='confirm_password'>
          Confirm Password
        </label>
        <input
          className='rounded-md px-4 py-2 bg-inherit border mb-6'
          type='password'
          name='confirm_password'
          placeholder='••••••••'
          aria-label='Confirm Password'
          required
        />
        <SubmitButton
          formAction={handleSignUp}
          className='bg-green-700 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2'
          pendingText='Signing Up...'
        >
          Sign Up
        </SubmitButton>
        <div className='mt-4 text-center'>
          <span>Already have an account? </span>
          <a href='/login' className='text-blue-500 hover:underline'>
            Sign in.
          </a>
        </div>
        {message && <p className='mt-4 p-4 bg-green-100 text-green-700 text-center'>{message}</p>}
        {error && <p className='mt-4 p-4 bg-red-100 text-red-700 text-center'>{error}</p>}
      </form>
      {searchParams?.message && (
        <p className='mt-4 p-4 bg-foreground/10 text-foreground text-center'>
          {searchParams.message}
        </p>
      )}
    </div>
  );
}
