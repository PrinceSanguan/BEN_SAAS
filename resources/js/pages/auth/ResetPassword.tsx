import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
    [key: string]: string;
}

interface ResetPasswordProps {
    token: string;
    errors: {
        email?: string;
        password?: string;
        password_confirmation?: string;
    };
}

export default function ResetPassword({ token, errors }: ResetPasswordProps) {
    const { data, setData, post, processing } = useForm<ResetPasswordForm>({
        token: token,
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop')",
            }}
        >
            <Head title="Reset Password" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-lg bg-black/70 p-6 text-white shadow-2xl backdrop-blur-md">
                    <h1 className="mb-2 text-center text-3xl font-extrabold">
                        <span className="text-blue-500">New</span> <span className="text-white">Password</span>
                    </h1>
                    <p className="mb-6 text-center text-sm text-gray-300">Enter your new password below</p>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="mb-1 text-sm font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    className="border-gray-600 bg-gray-800 pl-10 text-white placeholder-gray-400"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="password" className="mb-1 text-sm font-medium">
                                New Password
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="border-gray-600 bg-gray-800 pl-10 text-white placeholder-gray-400"
                                />
                            </div>
                            <InputError message={errors.password} />
                            <p className="mt-1 text-xs text-gray-400">Min 8 chars with uppercase, lowercase, number & special character</p>
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation" className="mb-1 text-sm font-medium">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="border-gray-600 bg-gray-800 pl-10 text-white placeholder-gray-400"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button type="submit" className="w-full py-3 text-base font-medium transition-all hover:shadow-lg" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Updating...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
