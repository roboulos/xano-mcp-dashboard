import Image from 'next/image';
import Link from 'next/link';

import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Signup = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50/40 via-white to-indigo-50/30 dark:from-slate-950 dark:via-purple-950/10 dark:to-indigo-950/20">
      <div className="container max-w-screen-xl px-6 py-28 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-4">
          <Card className="mx-auto w-full max-w-sm border-slate-900/8 bg-white shadow-[0_12px_32px_rgba(2,6,23,0.12),0_4px_16px_rgba(2,6,23,0.08)] dark:border-slate-100/8 dark:bg-slate-900 dark:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_4px_16px_rgba(0,0,0,0.3)]">
            <CardHeader className="flex flex-col items-center space-y-0">
              <Image
                src="/logo.svg"
                alt="logo"
                width={94}
                height={18}
                className="mb-7 dark:invert"
              />
              <p className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Start your free trial
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Sign up in less than 2 minutes.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="border-slate-200 bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-violet-400 dark:focus:ring-violet-400/20"
                />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="border-slate-200 bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-violet-400 dark:focus:ring-violet-400/20"
                />
                <div>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="border-slate-200 bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-violet-400 dark:focus:ring-violet-400/20"
                  />
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Must be at least 8 characters.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="mt-2 w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:brightness-110 dark:from-violet-500 dark:via-purple-500 dark:to-indigo-500"
                >
                  Create an account
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                >
                  <FcGoogle className="mr-2 size-5" />
                  Sign up with Google
                </Button>
              </div>
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
