import { Link } from '@inertiajs/react';
import { HomeIcon, UsersIcon, ChartBarIcon, Settings as SettingsIcon, LogOut as LogOutIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AdminSidebarProps {
    activePage: 'dashboard' | 'athletes' | 'analytics' | 'settings';
}

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
    const sidebarRef = useRef<HTMLElement>(null);
    const linksRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        // GSAP animation for sidebar entrance
        gsap.fromTo(
            sidebarRef.current,
            { x: -64, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        // Staggered animation for links
        gsap.fromTo(
            linksRef.current?.children || [],
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
        );
    }, []);

    // Helper function to safely generate routes
    const safeRoute = (routeName: string) => {
        try {
            return route(routeName);
        } catch {
            // Removed unused 'error' variable to fix ESLint warning
            // Fallback to dashboard if route doesn't exist
            console.warn(`Route ${routeName} not found, falling back to dashboard`);
            return route('admin.dashboard');
        }
    };

    return (
        <aside ref={sidebarRef} className="fixed left-0 top-0 h-full w-64 bg-[#0a1e3c] text-white shadow-lg z-10">
            {/* Admin Logo/Branding */}
            <div className="flex h-16 items-center justify-center border-b border-[#1e3a5f]">
                <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed] mr-3">
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 2.5 2.5 0 0 0 1.98 3A2.5 2.5 0 1 0 12 19.5a2.5 2.5 0 0 0 3.96.44 2.5 2.5 0 0 0 1.98-2.98 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5M12 12v7.5"></path>
                        </svg>
                    </div>
                    <span className="text-xl font-bold">
                        <span className="text-[#4a90e2]">Athlete</span><span className="text-white">Track</span>
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 px-4">
                <ul ref={linksRef} className="space-y-2">
                    <li>
                        <Link
                            href={safeRoute('admin.dashboard')}
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                                activePage === 'dashboard'
                                    ? 'bg-[#1e3a5f] text-[#4a90e2] border-l-4 border-[#4a90e2]'
                                    : 'text-[#a3c0e6] hover:bg-[#112845] hover:text-white'
                            }`}
                        >
                            <HomeIcon className="mr-3 h-5 w-5" />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        {/* <Link
                            href={safeRoute('admin.athletes')}
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                                activePage === 'athletes'
                                    ? 'bg-[#1e3a5f] text-[#4a90e2] border-l-4 border-[#4a90e2]'
                                    : 'text-[#a3c0e6] hover:bg-[#112845] hover:text-white'
                            }`}
                        >
                            <UsersIcon className="mr-3 h-5 w-5" />
                            Athletes
                        </Link> */}
                    </li>
                    <li>
                        {/*
                            <Link
                                href={safeRoute('admin.analytics')}
                                className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                                    activePage === 'analytics'
                                        ? 'bg-[#1e3a5f] text-[#4a90e2] border-l-4 border-[#4a90e2]'
                                        : 'text-[#a3c0e6] hover:bg-[#112845] hover:text-white'
                                }`}
                            >
                                <ChartBarIcon className="mr-3 h-5 w-5" />
                                Analytics
                            </Link>
                        */}
                    </li>
                    <li>
                        {/* <Link
                            href={safeRoute('admin.settings')}
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                                activePage === 'settings'
                                    ? 'bg-[#1e3a5f] text-[#4a90e2] border-l-4 border-[#4a90e2]'
                                    : 'text-[#a3c0e6] hover:bg-[#112845] hover:text-white'
                            }`}
                        >
                            <SettingsIcon className="mr-3 h-5 w-5" />
                            Settings
                        </Link> */}
                    </li>
                </ul>
            </nav>

            {/* Logout at bottom */}
            <div className="absolute bottom-0 left-0 w-full border-t border-[#1e3a5f] px-4 py-4">
                <Link
                    href={safeRoute('admin.logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center rounded-lg px-4 py-3 text-[#a3c0e6] hover:bg-[#112845] hover:text-white transition-colors"
                    preserveScroll
                >
                    <LogOutIcon className="mr-3 h-5 w-5" />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
