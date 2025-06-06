import { usePage } from '@inertiajs/react';
import type React from 'react';
import { useRef } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    username: string;
    routes?: {
        [key: string]: string;
    };
    pageTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    username,
    routes = {},
    pageTitle = 'Dashboard'
}) => {
    const { url } = usePage();
    const mainContentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            {/* Sidebar */}
            <Sidebar
                username={username}
                routes={routes}
                currentRoute={url}
            />

            {/* Main Content */}
            <div ref={mainContentRef} className="ml-64 flex-1">
                <header className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-8 py-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-8 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
