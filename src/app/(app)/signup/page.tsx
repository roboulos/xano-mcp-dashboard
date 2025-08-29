'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the auth token
        localStorage.setItem('authToken', data.authToken);
        toast({
          title: 'Success',
          description: 'Account created successfully! Redirecting...',
        });
        router.push('/dashboard');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create account',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50/40 via-white to-indigo-50/30 dark:from-slate-950 dark:via-purple-950/10 dark:to-indigo-950/20">
      <div className="container max-w-screen-xl px-6 py-28 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-4">
          <Card className="mx-auto w-full max-w-sm border-slate-900/8 bg-white shadow-[0_12px_32px_rgba(2,6,23,0.12),0_4px_16px_rgba(2,6,23,0.08)] dark:border-slate-100/8 dark:bg-slate-900 dark:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_4px_16px_rgba(0,0,0,0.3)]">
            <CardHeader className="flex flex-col items-center space-y-0">
              <p className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Start Building 10x Faster
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Get instant access to MCP tools and training.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isLoading}
                    className="border-slate-200 bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-violet-400 dark:focus:ring-violet-400/20"
                  />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isLoading}
                    className="border-slate-200 bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-violet-400 dark:focus:ring-violet-400/20"
                  />
                  <div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={e =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      disabled={isLoading}
                      minLength={8}
                      className="border-slate-200 bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-violet-400 dark:focus:ring-violet-400/20"
                    />
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Must be at least 8 characters.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 disabled:opacity-50 dark:from-violet-500 dark:via-purple-500 dark:to-indigo-500"
                  >
                    {isLoading ? 'Creating account...' : 'Create an account'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="w-full border-slate-200 text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  >
                    <FcGoogle className="mr-2 size-5" />
                    Sign up with Google
                  </Button>
                </div>
              </form>
              <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                <p>Already have an account?</p>
                <Link
                  href="/login"
                  className="font-medium text-violet-600 transition-colors duration-200 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Signup;
