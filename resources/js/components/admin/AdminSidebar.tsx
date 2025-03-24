import { Link } from '@inertiajs/react';
import { HomeIcon, UsersIcon, ChartBarIcon, Settings as SettingsIcon, LogOut as LogOutIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface AdminSidebarProps {
    activePage: 'dashboard' | 'athletes' | 'analytics' | 'settings';
    isMobile?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ activePage, isMobile = false, onClose }: AdminSidebarProps) {
    const sidebarRef = useRef<HTMLElement>(null);
    const linksRef = useRef<HTMLUListElement>(null);
    const mobileNavRef = useRef<HTMLDivElement>(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        // Reset any inline styles that might interfere with responsive behavior
        if (sidebarRef.current) {
            sidebarRef.current.style.transform = '';
            sidebarRef.current.style.opacity = '';
        }

        // Different animations based on device type
        if (!isMobile) {
            // Desktop sidebar animation
            gsap.fromTo(
                sidebarRef.current,
                { x: -64, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
            );

            // Staggered animation for links in desktop
            gsap.fromTo(
                linksRef.current?.children || [],
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
            );
        } else {
            // Mobile bottom tabs animation
            gsap.fromTo(
                mobileNavRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [isMobile, showMobileMenu]);

    // Helper function to safely generate routes
    const safeRoute = (routeName: string) => {
        try {
            return route(routeName);
        } catch {
            console.warn(`Route ${routeName} not found, falling back to dashboard`);
            return route('admin.dashboard');
        }
    };

    // Mobile expanded menu
    const renderMobileMenu = () => {
        if (!showMobileMenu) return null;

        return (
            <>
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setShowMobileMenu(false)}
                />
                <div className="fixed bottom-16 left-0 right-0 bg-[#0a1e3c] rounded-t-xl shadow-lg z-50 pb-4 px-4 pt-6">
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href={safeRoute('admin.dashboard')}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                                activePage === 'dashboard' ? 'bg-[#1e3a5f] text-[#4a90e2]' : 'text-[#a3c0e6]'
                            }`}
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <HomeIcon className="h-6 w-6 mb-2" />
                            <span className="text-sm">Dashboard</span>
                        </Link>

                        <Link
                            href={safeRoute('admin.athletes')}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                                activePage === 'athletes' ? 'bg-[#1e3a5f] text-[#4a90e2]' : 'text-[#a3c0e6]'
                            }`}
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <UsersIcon className="h-6 w-6 mb-2" />
                            <span className="text-sm">Athletes</span>
                        </Link>

                        <Link
                            href={safeRoute('admin.analytics')}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                                activePage === 'analytics' ? 'bg-[#1e3a5f] text-[#4a90e2]' : 'text-[#a3c0e6]'
                            }`}
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <ChartBarIcon className="h-6 w-6 mb-2" />
                            <span className="text-sm">Analytics</span>
                        </Link>

                        <Link
                            href={safeRoute('admin.logout')}
                            method="post"
                            as="button"
                            className="flex flex-col items-center justify-center p-4 rounded-lg text-[#a3c0e6]"
                            preserveScroll
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <LogOutIcon className="h-6 w-6 mb-2" />
                            <span className="text-sm">Logout</span>
                        </Link>
                    </div>
                </div>
            </>
        );
    };

    // Mobile bottom tabs
    if (isMobile) {
        return (
            <>
                {/* Mobile Bottom Navigation */}
                <div
                    ref={mobileNavRef}
                    className="fixed bottom-0 left-0 right-0 bg-[#0a1e3c] shadow-lg border-t border-[#1e3a5f] z-30"
                >
                    <div className="grid grid-cols-5 h-16">
                        {/* <Link
                            href={safeRoute('admin.dashboard')}
                            className={`flex flex-col items-center justify-center ${
                                activePage === 'dashboard' ? 'text-[#4a90e2]' : 'text-[#a3c0e6]'
                            }`}
                        >
                            <HomeIcon className="h-6 w-6" />
                            <span className="text-xs mt-1">Home</span>
                        </Link> */}

                        {/* <Link
                            href={safeRoute('admin.athletes')}
                            className={`flex flex-col items-center justify-center ${
                                activePage === 'athletes' ? 'text-[#4a90e2]' : 'text-[#a3c0e6]'
                            }`}
                        >
                            <UsersIcon className="h-6 w-6" />
                            <span className="text-xs mt-1">Athletes</span>
                        </Link> */}

                        {/* Menu button in the middle */}
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="flex flex-col items-center justify-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center -mt-5 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </div>
                                <span className="text-xs mt-1 text-[#a3c0e6]">Menu</span>
                            </button>
                        </div>

                        {/* <Link
                            href={safeRoute('admin.analytics')}
                            className={`flex flex-col items-center justify-center ${
                                activePage === 'analytics' ? 'text-[#4a90e2]' : 'text-[#a3c0e6]'
                            }`}
                        >
                            <ChartBarIcon className="h-6 w-6" />
                            <span className="text-xs mt-1">Stats</span>
                        </Link> */}

                        {/* <Link
                            href={safeRoute('admin.settings')}
                            className={`flex flex-col items-center justify-center ${
                                activePage === 'settings' ? 'text-[#4a90e2]' : 'text-[#a3c0e6]'
                            }`}
                        >
                            <SettingsIcon className="h-6 w-6" />
                            <span className="text-xs mt-1">Settings</span>
                        </Link> */}
                    </div>
                </div>

                {/* Expanded Mobile Menu */}
                {renderMobileMenu()}
            </>
        );
    }

    // Desktop sidebar
    return (
        <aside
            ref={sidebarRef}
            className="h-full w-64 bg-[#0a1e3c] text-white shadow-lg overflow-y-auto fixed left-0 top-0 z-10"
        >
            {/* Admin Logo/Branding */}
            <div className="flex h-16 items-center justify-center border-b border-[#1e3a5f] px-3">
                <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed] mr-3 flex-shrink-0">
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 2.5 2.5 0 0 0 1.98 3A2.5 2.5 0 1 0 12 19.5a2.5 2.5 0 0 0 3.96.44 2.5 2.5 0 0 0 1.98-2.98 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5M12 12v7.5"></path>
                        </svg>
                    </div>
                    <span className="text-xl font-bold truncate">
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
                            <HomeIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                            <span>Dashboard</span>
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
                            <UsersIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                            <span>Athletes</span>
                        </Link> */}
                    </li>
                    <li>
                    <Link
                            href={safeRoute('admin.athletes')}
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                                activePage === 'athletes'
                                    ? 'bg-[#1e3a5f] text-[#4a90e2] border-l-4 border-[#4a90e2]'
                                    : 'text-[#a3c0e6] hover:bg-[#112845] hover:text-white'
                            }`}
                        >
                            <UsersIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                            <span>Athletes</span>
                        </Link>
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
                            <SettingsIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                            <span>Settings</span>
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
                    <LogOutIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
