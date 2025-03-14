import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

/**
 * Interface for the login form data.
 */
interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
  [key: string]: string | boolean;
}

/**
 * Component props.
 */
interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  // Set up form state using Inertia's useForm hook.
  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your account to continue your journey"
    >
      <Head title="Log in" />

      {/* Display status message if available */}
      {status && (
        <div className="mb-6 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-600 shadow-sm">
          {status}
        </div>
      )}

      <div className="mb-8 flex justify-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
      </div>

      <form className="flex flex-col gap-6" onSubmit={submit}>
        <div className="grid gap-6">
          {/* Email Input */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                type="email"
                required
                autoFocus
                tabIndex={1}
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="email@example.com"
                className="pl-10"
              />
            </div>
            <InputError message={errors.email} />
          </div>

          {/* Password Input */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              {canResetPassword && (
                <TextLink
                  href={route('password.request')}
                  className="ml-auto text-sm hover:text-primary"
                  tabIndex={5}
                >
                  Forgot password?
                </TextLink>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="password"
                type="password"
                required
                tabIndex={2}
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
            <InputError message={errors.password} />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="remember"
              name="remember"
              tabIndex={3}
              checked={data.remember}
              onCheckedChange={(checked) => setData('remember', checked === true)}
            />
            <Label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me for 30 days
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-4 w-full py-6 text-base font-medium transition-all hover:shadow-lg"
            tabIndex={4}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <span className="relative bg-background px-4 text-xs uppercase text-muted-foreground">
              Or continue with
            </span>
          </div>

          <div className="mt-6 text-muted-foreground text-sm">
            Don't have an account?{' '}
            <TextLink href={route('register')} tabIndex={5} className="font-medium hover:text-primary">
              Create an account
            </TextLink>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}