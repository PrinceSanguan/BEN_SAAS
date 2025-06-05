import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle, LoaderCircle, Mail, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordForm {
    email: string;
    [key: string]: string;
}

interface ForgotPasswordProps {
    success?: boolean;
    email?: string;
    message?: string;
    errors: {
        email?: string;
    };
}

export default function ForgotPassword({ success, email: successEmail, message, errors }: ForgotPasswordProps) {
    const { data, setData, post, processing } = useForm<ForgotPasswordForm>({
        email: '',
    });

    const [showModal, setShowModal] = useState(false);

    // Show modal immediately if success prop is true
    useEffect(() => {
        console.log('Success prop:', success); // Debug log
        if (success === true) {
            setShowModal(true);
        }
    }, [success]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const handleModalClose = () => {
        setShowModal(false);
        router.visit(route('login'));
    };

    const displayEmail = successEmail || data.email;

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop')",
            }}
        >
            <Head title="Forgot Password" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />

            {/* Success Modal - ALWAYS RENDER WHEN showModal IS TRUE */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleModalClose}></div>
                    <div className="animate-in fade-in relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl duration-300">
                        <div className="text-center">
                            {/* Close button */}
                            <button onClick={handleModalClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>

                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>

                            <h3 className="mb-2 text-xl font-semibold text-gray-900">Email Sent Successfully! 🎉</h3>

                            <p className="mb-6 text-gray-600">
                                {message || `We've sent a password reset link to `}
                                {displayEmail && <strong className="text-blue-600">{displayEmail}</strong>}
                            </p>

                            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left text-sm text-blue-800">
                                <p className="mb-2 font-semibold">📧 Next Steps:</p>
                                <div className="space-y-1">
                                    <p>• Check your email inbox right now</p>
                                    <p>• Look for "Young Athlete Training" in the sender</p>
                                    <p>• Check spam/junk folder if you don't see it</p>
                                    <p>• The reset link expires in 1 hour ⏰</p>
                                </div>
                            </div>

                            <Button onClick={handleModalClose} className="w-full bg-blue-600 py-2 font-medium text-white hover:bg-blue-700">
                                Perfect! Back to Login
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-lg bg-black/70 p-6 text-white shadow-2xl backdrop-blur-md">
                    <h1 className="mb-2 text-center text-3xl font-extrabold">
                        <span className="text-blue-500">Reset</span> <span className="text-white">Password</span>
                    </h1>
                    <p className="mb-6 text-center text-sm text-gray-300">Enter your email address and we'll send you a password reset link</p>

                    {/* Debug info - remove this after testing */}
                    {success && (
                        <div className="mb-4 rounded bg-yellow-900/20 p-2 text-xs text-yellow-300">
                            Debug: Success = {String(success)}, Show Modal = {String(showModal)}
                        </div>
                    )}

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

                        <Button type="submit" className="w-full py-3 text-base font-medium transition-all hover:shadow-lg" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Sending Email...
                                </span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>

                        <div className="text-center text-sm">
                            <TextLink href={route('login')} className="text-blue-400 hover:text-blue-300">
                                ← Back to Login
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
