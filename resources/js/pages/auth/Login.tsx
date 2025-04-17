import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, LoaderCircle, Lock, User } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    login: string; // Changed from username to login to accept both username and email
    password: string;
    isAdmin: boolean;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    errors: {
        credentials?: string;
        login?: string; // Changed from username to login
        password?: string;
    };
}

export default function Login({ status, errors }: LoginProps) {
    const { data, setData, post, processing, reset } = useForm<LoginForm>({
        login: '', // Changed from username to login
        password: '',
        isAdmin: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.submit'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop')",
            }}
        >
            <Head title="Log in" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-lg bg-black/70 p-6 text-white shadow-2xl backdrop-blur-md">
                    <h1 className="mb-2 text-center text-3xl font-extrabold">
                        <span className="text-blue-500">Young Athlete</span> <span className="text-white">App</span>
                    </h1>
                    <p className="mb-6 text-center text-sm text-gray-300">Sign in to access your training program</p>

                    {status && <div className="mb-4 rounded bg-green-100 p-3 text-center text-sm font-medium text-green-700 shadow-sm">{status}</div>}

                    {/* Display global credentials error */}
                    {errors.credentials && (
                        <Alert variant="destructive" className="mb-4 border-red-500 bg-red-900/50 text-white">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.credentials}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="login" className="mb-1 text-sm font-medium">
                                Username or Email
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    id="login"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username email"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="username or email@example.com"
                                    className="border-gray-600 bg-gray-800 pl-10 text-white placeholder-gray-400"
                                />
                            </div>
                            <InputError message={errors.login} />
                        </div>

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
                            <p className="mt-1 text-xs text-gray-400"></p>
                        </div>

                        <div>
                            <p className="mt-1 text-xs text-gray-400"></p>
                        </div>

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
