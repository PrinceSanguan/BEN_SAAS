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
        <aside ref={sidebarRef} className="fixed left-0 top-0 h-full w-64 bg-[#0a1428] text-white shadow-lg z-10">
            {/* Admin Logo/Branding */}
            <div className="flex h-16 items-center justify-center border-b border-[#1e2c47]">
                <span className="text-xl font-bold">
                    <span className="text-blue-400">Young Athlete</span> <span className="text-white">Admin</span>
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 px-4">
                <ul ref={linksRef} className="space-y-2">
                    <li>
                        <Link
                            href={safeRoute('admin.dashboard')}
                            className={`flex items-center rounded-md px-4 py-3 transition-colors ${
                                activePage === 'dashboard'
                                    ? 'bg-[#1e88e5] text-white'
                                    : 'text-gray-300 hover:bg-[#162344] hover:text-white'
                            }`}
                        >
                            <HomeIcon className="mr-3 h-5 w-5" />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={safeRoute('admin.athletes')}
                            className={`flex items-center rounded-md px-4 py-3 transition-colors ${
                                activePage === 'athletes'
                                    ? 'bg-[#1e88e5] text-white'
                                    : 'text-gray-300 hover:bg-[#162344] hover:text-white'
                            }`}
                        >
                            <UsersIcon className="mr-3 h-5 w-5" />
                            Athletes
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={safeRoute('admin.analytics')}
                            className={`flex items-center rounded-md px-4 py-3 transition-colors ${
                                activePage === 'analytics'
                                    ? 'bg-[#1e88e5] text-white'
                                    : 'text-gray-300 hover:bg-[#162344] hover:text-white'
                            }`}
                        >
                            <ChartBarIcon className="mr-3 h-5 w-5" />
                            Analytics
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={safeRoute('admin.settings')}
                            className={`flex items-center rounded-md px-4 py-3 transition-colors ${
                                activePage === 'settings'
                                    ? 'bg-[#1e88e5] text-white'
                                    : 'text-gray-300 hover:bg-[#162344] hover:text-white'
                            }`}
                        >
                            <SettingsIcon className="mr-3 h-5 w-5" />
                            Settings
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Logout at bottom */}
            <div className="absolute bottom-0 left-0 w-full border-t border-[#1e2c47] px-4 py-4">
                <Link
                    href={safeRoute('admin.logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center rounded-md px-4 py-3 text-gray-300 hover:bg-[#162344] hover:text-white transition-colors"
                    preserveScroll
                >
                    <LogOutIcon className="mr-3 h-5 w-5" />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
