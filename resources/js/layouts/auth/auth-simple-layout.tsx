import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            {/* Commenting out the logo:
                            <img
                                src="/assets/images/company-logo.webp"
                                alt="Company Logo"
                                width="64"
                                height="64"
                                className="rounded-full"
                            /> */}
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            {/* Changed the title to 'Young Athlete App' in blue */}
                            <h1 className="text-center text-3xl font-extrabold">
                                <span className="text-blue-500">Young Athlete</span>{' '}
                                <span className="text-white">App</span>
                            </h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
