'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSignInForm } from '@/hooks/sign-in/use-sign-in-form';
import { useAuth } from '@/hooks/auth';

export default function SignInPage() {
  const router = useRouter();
  const { formData, errors, isLoading, authError, handleChange, handleSubmit } =
    useSignInForm();

  const { user } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    // Note: handleSubmit updates the Redux store on success.
    // The useEffect below will handle navigation when user state changes.
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [user, router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Timeslip HR
          </p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={onSubmit}>
          {authError && (
            <div className='rounded-md bg-red-50 p-4'>
              <p className='text-sm text-red-700'>{authError}</p>
            </div>
          )}
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={formData.password}
                onChange={handleChange}
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Password'
              />
              {errors.password && (
                <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
