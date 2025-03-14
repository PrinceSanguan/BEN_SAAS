import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle, Lock, User } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Interface for the login form data.
 */
interface LoginForm {
  username: string;
  password: string;
  isAdmin: boolean; // For administrator login
  [key: string]: string | boolean;
}

/**
 * Component props.
 */
interface LoginProps {
  status?: string;
}

export default function Login({ status }: LoginProps) {
  // Set up form state using Inertia's useForm hook.
  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    username: '',
    password: '',
    isAdmin: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop')",
      }}
    >
      <Head title="Log in" />

      {/* Black Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />

      {/* Centered Form Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg bg-black/70 p-6 text-white shadow-2xl backdrop-blur-md">
          {/* Larger, bolder, centered title */}
          <h1 className="mb-2 text-center text-3xl font-extrabold">
            <span className="text-blue-500">Young Athlete</span>{' '}
            <span className="text-white">App</span>
          </h1>
          <p className="mb-6 text-center text-sm text-gray-300">
            Sign in to access your training program
          </p>

          {/* Display any status message if available */}
          {status && (
            <div className="mb-4 rounded bg-green-100 p-3 text-center text-sm font-medium text-green-700 shadow-sm">
              {status}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {/* Username */}
            <div>
              <Label htmlFor="username" className="mb-1 text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="username"
                  type="text"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="username"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                  placeholder="admin@gmail.com"
                  className="border-gray-600 bg-gray-800 pl-10 text-white placeholder-gray-400"
                />
              </div>
              <InputError message={errors.username} />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="mb-1 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Lock className="h-4 w-4 text-gray-400" />
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
                  className="border-gray-600 bg-gray-800 pl-10 text-white placeholder-gray-400"
                />
              </div>
              <InputError message={errors.password} />
              <p className="mt-1 text-xs text-gray-400">
                (Hint: For demo, use <strong>password</strong> for athlete login)
              </p>
            </div>

            {/* Admin Checkbox */}
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAdmin"
                  name="isAdmin"
                  tabIndex={3}
                  checked={data.isAdmin}
                  onCheckedChange={(checked) => setData('isAdmin', checked === true)}
                  className="border-gray-500 text-blue-500"
                />
                <Label htmlFor="isAdmin" className="text-sm text-gray-300">
                  Login as Administrator
                </Label>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                (For admin, use username <strong>admin</strong> and password <strong>admin</strong>)
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-base font-medium transition-all hover:shadow-lg"
              tabIndex={4}
              disabled={processing}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
