import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { HomeIcon, LogOut as LogOutIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AdminSidebarProps {
    activePage: 'dashboard' | 'email-templates' | 'summaries' | 'page-content';
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
            gsap.fromTo(sidebarRef.current, { x: -64, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });

            // Staggered animation for links in desktop
            gsap.fromTo(
                linksRef.current?.children || [],
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.2, ease: 'power2.out' },
            );
        } else {
            // Mobile bottom tabs animation
            gsap.fromTo(mobileNavRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
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
                <div className="bg-opacity-50 fixed inset-0 z-40 bg-black" onClick={() => setShowMobileMenu(false)} />
                <div className="fixed right-0 bottom-16 left-0 z-50 rounded-t-xl bg-[#0a1e3c] px-4 pt-6 pb-4 shadow-lg">
                    <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-300" />

                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href={safeRoute('admin.dashboard')}
                            className={`flex flex-col items-center justify-center rounded-lg p-4 ${
                                activePage === 'dashboard' ? 'bg-[#1e3a5f] text-[#4a90e2]' : 'text-[#a3c0e6]'
                            }`}
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <HomeIcon className="mb-2 h-6 w-6" />
                            <span className="text-sm">Dashboard</span>
                        </Link>

                        <Link
                            href={safeRoute('admin.logout')}
                            method="post"
                            as="button"
                            className="flex flex-col items-center justify-center rounded-lg p-4 text-[#a3c0e6]"
                            preserveScroll
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <LogOutIcon className="mb-2 h-6 w-6" />
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
                <div ref={mobileNavRef} className="fixed right-0 bottom-0 left-0 z-30 border-t border-[#1e3a5f] bg-[#0a1e3c] shadow-lg">
                    <div className="grid h-16 grid-cols-5">
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
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="flex flex-col items-center justify-center">
                                <div className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </div>
                                <span className="mt-1 text-xs text-[#a3c0e6]">Menu</span>
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
        <aside ref={sidebarRef} className="fixed top-0 left-0 z-10 h-full w-64 overflow-y-auto bg-[#0a1e3c] text-white shadow-lg">
            {/* Admin Logo/Branding */}
            <div className="flex h-16 items-center justify-center border-b border-[#1e3a5f] px-3">
                <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                        <svg
                            className="h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 2.5 2.5 0 0 0 1.98 3A2.5 2.5 0 1 0 12 19.5a2.5 2.5 0 0 0 3.96.44 2.5 2.5 0 0 0 1.98-2.98 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5M12 12v7.5"></path>
                        </svg>
                    </div>
                    <span className="truncate text-xl font-bold">
                        <span className="text-white">Track</span>
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
                                    ? 'border-l-4 border-[#4a90e2] bg-[#1e3a5f] text-[#4a90e2]'
                                    : 'text-[#a3c0e6] hover:bg-[#112845] hover:text-white'
                            }`}
                        >
                            <HomeIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={safeRoute('admin.email-templates')}
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                                activePage === 'email-templates'
                                    ? 'border-l-4 border-[#4a90e2] bg-[#1e3a5f] text-[#4a90e2]'
                                    : 'text-[#a3c0e6] hover:bg-[#112845] hover:text-white'
                            }`}
                        >
                            <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <span>Email Templates</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={safeRoute('admin.page-content')}
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                                activePage === 'page-content'
                                    ? 'border-l-4 border-[#4a90e2] bg-[#1e3a5f] text-[#4a90e2]'
                                    : 'text-[#a3c0e6] hover:bg-[#112845] hover:text-white'
                            }`}
                        >
                            <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            <span>Page Content</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Logout at bottom */}
            <div className="absolute bottom-0 left-0 w-full border-t border-[#1e3a5f] px-4 py-4">
                <Link
                    href={safeRoute('admin.logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#112845] hover:text-white"
                    preserveScroll
                >
                    <LogOutIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
