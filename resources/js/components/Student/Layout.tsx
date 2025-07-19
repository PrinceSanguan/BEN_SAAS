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

const Layout: React.FC<LayoutProps> = ({ children, username, routes = {}, pageTitle = 'Dashboard' }) => {
    const { url } = usePage();
    const mainContentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar username={username} routes={routes} currentRoute={url} />
            </div>

            {/* Main Content */}
            <div ref={mainContentRef} className="flex-1 lg:ml-64">
                <header className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-4 py-4 backdrop-blur-md lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-white lg:text-2xl">{pageTitle}</h1>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
