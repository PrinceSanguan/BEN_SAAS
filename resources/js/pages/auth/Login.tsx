import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, LoaderCircle, Lock, User } from 'lucide-react';
import { FormEventHandler, useEffect, useRef } from 'react';
import gsap from 'gsap';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    login: string;
    password: string;
    isAdmin: boolean;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    errors: {
        credentials?: string;
        login?: string;
        password?: string;
    };
}

export default function Login({ status, errors }: LoginProps) {
    const { data, setData, post, processing, reset } = useForm<LoginForm>({
        login: '',
        password: '',
        isAdmin: false,
    });

    const circle1 = useRef<HTMLDivElement>(null);
    const circle2 = useRef<HTMLDivElement>(null);
    const circle3 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (circle1.current && circle2.current && circle3.current) {
            gsap.fromTo(
                circle1.current,
                { opacity: 0.2, y: -40 },
                { opacity: 0.4, y: 0, duration: 2, repeat: -1, yoyo: true, ease: 'power1.inOut' }
            );
            gsap.fromTo(
                circle2.current,
                { opacity: 0.1, x: 40 },
                { opacity: 0.2, x: 0, duration: 2.5, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 0.5 }
            );
            gsap.fromTo(
                circle3.current,
                { opacity: 0.05, y: 40 },
                { opacity: 0.1, y: 0, duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1 }
            );
        }
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.submit'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div
            className="relative min-h-screen bg-gradient-to-br from-[#0a1437] via-[#10182a] to-black overflow-hidden"
        >
            {/* Subtle squared grid overlay */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Subtle, dark blurred circles with animation refs */}
            <div ref={circle1} className="absolute -top-32 -left-32 w-96 h-96 bg-blue-900 opacity-20 rounded-full filter blur-3xl z-0" />
            <div ref={circle2} className="absolute top-1/2 left-3/4 w-80 h-80 bg-blue-800 opacity-15 rounded-full filter blur-2xl z-0" />
            <div ref={circle3} className="absolute bottom-0 right-0 w-72 h-72 bg-blue-950 opacity-10 rounded-full filter blur-2xl z-0" />

            <Head title="Log in" />

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-2xl bg-black/60 p-8 text-white shadow-2xl backdrop-blur-xl border border-white/10" style={{boxShadow: '0 8px 32px 0 rgba(10,20,55,0.37)'}}>
                    <h1 className="mb-2 text-center text-3xl font-extrabold">
                        <span className="text-blue-500">Young Athlete</span> <span className="text-white">App</span>
                    </h1>
                    <p className="mb-6 text-center text-sm text-gray-300">Sign in to access your training program</p>

                    {/* Status message for password reset success */}
                    {status && (
                        <div className="mb-4 rounded border border-green-500 bg-green-900/50 p-3 text-center text-sm font-medium text-green-300 shadow-sm">
                            {status}
                        </div>
                    )}

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

                        <div className="text-center text-sm">
                            <TextLink href={route('password.request')} className="text-blue-400 hover:text-blue-300">
                                Forgot your password? →
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
