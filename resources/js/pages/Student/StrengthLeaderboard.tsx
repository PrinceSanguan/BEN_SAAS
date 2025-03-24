import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    Activity,
    Award,
    BarChart2,
    Home,
    LogOut,
    Menu,
    Trophy,
    User,
    X,
} from 'lucide-react';

interface LeaderboardUser {
    id: number;
    rank: number;
    username: string;
    consistency_score: number;
    completed_sessions: number;
    isYou: boolean;
}

interface ConsistencyLeaderboardProps {
    leaderboardData: LeaderboardUser[];
    username?: string;
    routes?: {
        [key: string]: string;
    };
}

const ConsistencyLeaderboard: React.FC<ConsistencyLeaderboardProps> = ({
    leaderboardData,
    username = 'Athlete',
    routes = {}
}) => {
    // State for responsive design
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Refs for GSAP animations
    const pageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    // Check if using mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // GSAP animations
    useEffect(() => {
        // Skip animations on mobile
        if (isMobile) return;

        // Use a short timeout to ensure DOM is fully ready
        const animationTimeout = setTimeout(() => {
            const tl = gsap.timeline();

            // Page fade in
            if (pageRef.current) {
                tl.from(pageRef.current, {
                    opacity: 0.8,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            }

            // Header animation
            if (headerRef.current) {
                tl.from(
                    headerRef.current,
                    {
                        y: -20,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'back.out(1.7)',
                    },
                    '-=0.2',
                );
            }

            // Sidebar animation
            if (sidebarRef.current) {
                tl.from(
                    sidebarRef.current,
                    {
                        x: -30,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                    },
                    '-=0.2',
                );
            }

            // Main content animation
            if (mainContentRef.current) {
                tl.from(
                    mainContentRef.current,
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                    },
                    '-=0.2',
                );
            }
        }, 100);

        return () => {
            clearTimeout(animationTimeout);
        };
    }, [isMobile]);

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Get route helper function
    const getRoute = (name: string): string => {
        // Check if routes object exists and contains the route
        if (routes && routes[name]) {
            return routes[name];
        }

        // Check if window.route function is available (Ziggy)
        if (typeof window !== 'undefined' && window.route && typeof window.route === 'function') {
            try {
                return window.route(name);
            } catch (e) {
                console.error('Error using window.route:', e);
            }
        }

        // Fallback routes
        const fallbackRoutes: Record<string, string> = {
            'student.dashboard': '/dashboard',
            'student.training': '/training',
            'leaderboard.strength': '/leaderboard/strength',
            'leaderboard.consistency': '/leaderboard/consistency',
            'student.progress': '/progress',
        };

        return fallbackRoutes[name] || '#';
    };

    // Render leaderboard cards for mobile
    const renderMobileLeaderboard = () => {
        if (leaderboardData.length === 0) {
            return (
                <div className="py-4 text-center text-[#a3c0e6]">
                    No data available yet
                </div>
            );
        }

        return (
            <div className="space-y-3 px-1 py-2">
                {leaderboardData.map((user) => (
                    <div
                        key={user.id}
                        className={`rounded-lg border border-[#1e3a5f] p-4 ${user.isYou ? 'bg-[#1e3a5f]/30' : 'bg-[#112845]'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <span className="mr-3 text-xl font-bold text-white">
                                    {user.rank === 1 && <span className="mr-1">🏆</span>}
                                    {user.rank === 2 && <span className="mr-1">🥈</span>}
                                    {user.rank === 3 && <span className="mr-1">🥉</span>}
                                    {user.rank}
                                </span>
                                <span className="text-base text-[#a3c0e6]">
                                    {user.username} {user.isYou && <span className="text-sm font-medium text-[#4a90e2]">(You)</span>}
                                </span>
                            </div>
                            <span className="rounded-full bg-[#1e3a5f] px-2 py-1 text-xs text-[#a3c0e6]">
                                {user.completed_sessions} sessions
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="flex items-center">
                                <div className="mr-3 h-2.5 w-full rounded-full bg-[#1e3a5f]">
                                    <div
                                        className="h-2.5 rounded-full bg-[#7c3aed]"
                                        style={{ width: `${user.consistency_score}%` }}
                                    ></div>
                                </div>
                                <span className="ml-2 whitespace-nowrap text-sm font-medium text-[#7c3aed]">
                                    {user.consistency_score}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div ref={pageRef} className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            <Head title="Consistency Leaderboard" />

            {/* Sidebar - Desktop Only */}
            <div ref={sidebarRef} className="fixed z-30 hidden h-full border-r border-[#1e3a5f] bg-[#0a1e3c] lg:flex lg:w-64 lg:flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-[#1e3a5f] px-6">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                        <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white">AthleteTrack</h1>
                </div>

                {/* User Profile */}
                <div className="border-b border-[#1e3a5f] p-4">
                    <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f]">
                            <User className="h-5 w-5 text-[#4a90e2]" />
                        </div>
                        <div>
                            <h2 className="text-sm font-medium text-white">{username}</h2>
                            <p className="text-xs text-[#a3c0e6]">Athlete</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-2 py-4">
                    <a
                        href={getRoute('student.dashboard')}
                        className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/50"
                    >
                        <Home className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
                        <span className="group-hover:text-white">Dashboard</span>
                    </a>
                    <a
                        href={getRoute('student.training')}
                        className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/50"
                    >
                        <Activity className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
                        <span className="group-hover:text-white">Training</span>
                    </a>

                    <div className="mt-4 border-t border-[#1e3a5f] pt-4">
                        <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-[#a3c0e6] uppercase">Leaderboards</h3>
                        <a
                            href={getRoute('leaderboard.strength')}
                            className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/50"
                        >
                            <Award className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
                            <span className="group-hover:text-white">Strength</span>
                        </a>
                        <a
                            href={getRoute('leaderboard.consistency')}
                            className="group flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white"
                        >
                            <BarChart2 className="mr-3 h-5 w-5 text-[#7c3aed]" />
                            <span>Consistency</span>
                        </a>
                    </div>
                </nav>

                {/* Footer */}
                <div className="border-t border-[#1e3a5f] p-4">
                    <a href="#" className="flex items-center px-4 py-2 text-[#a3c0e6] transition-colors hover:text-white">
                        <LogOut className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Logout</span>
                    </a>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={toggleSidebar}></div>}

            {/* Mobile sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[#1e3a5f] bg-[#0a1e3c] transition-transform duration-300 ease-in-out lg:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-[#1e3a5f] px-6">
                    <div className="flex items-center">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                            <Trophy className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-white">AthleteTrack</h1>
                    </div>
                    <button onClick={toggleSidebar} className="text-[#a3c0e6] hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 space-y-1 px-2 py-4">
                    <a
                        href={getRoute('student.dashboard')}
                        className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
                    >
                        <Home className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Dashboard</span>
                    </a>
                    <a
                        href={getRoute('student.training')}
                        className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
                    >
                        <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Training</span>
                    </a>

                    <div className="mt-4 border-t border-[#1e3a5f] pt-4">
                        <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-[#a3c0e6] uppercase">Leaderboards</h3>
                        <a
                            href={getRoute('leaderboard.strength')}
                            className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
                        >
                            <Award className="mr-3 h-5 w-5 text-[#4a90e2]" />
                            <span>Strength</span>
                        </a>
                        <a
                            href={getRoute('leaderboard.consistency')}
                            className="flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white"
                        >
                            <BarChart2 className="mr-3 h-5 w-5 text-[#7c3aed]" />
                            <span>Consistency</span>
                        </a>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Header */}
                <header
                    ref={headerRef}
                    className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-4 py-4 backdrop-blur-md"
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center">
                            <button onClick={toggleSidebar} className="mr-4 text-[#a3c0e6] hover:text-white lg:hidden">
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#9f6aff] mr-3">
                                <BarChart2 className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">Consistency Leaderboard</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main ref={mainContentRef} className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-6">
                    <div className="overflow-hidden rounded-xl bg-[#112845] shadow-lg border border-[#1e3a5f]">
                        {/* Desktop view - Table */}
                        <div className="hidden sm:block">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[#1e3a5f]">
                                    <thead className="bg-[#0a1e3c]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Rank
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Username
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Consistency
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Completed Sessions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1e3a5f] bg-[#112845]">
                                        {leaderboardData.length > 0 ? (
                                            leaderboardData.map((user) => (
                                                <tr key={user.id} className={user.isYou ? 'bg-[#1e3a5f]/30' : undefined}>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white">
                                                        {user.rank === 1 && <span className="mr-2">🏆</span>}
                                                        {user.rank === 2 && <span className="mr-2">🥈</span>}
                                                        {user.rank === 3 && <span className="mr-2">🥉</span>}
                                                        {user.rank}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-[#a3c0e6]">
                                                        {user.username} {user.isYou && <span className="font-medium text-[#4a90e2]">(You)</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="mr-2 h-2 w-24 rounded-full bg-[#1e3a5f]">
                                                                <div
                                                                    className="h-2 rounded-full bg-[#7c3aed]"
                                                                    style={{ width: `${user.consistency_score}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-[#7c3aed]">{user.consistency_score}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-[#a3c0e6]">{user.completed_sessions}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-[#a3c0e6]">
                                                    No data available yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile view - Cards */}
                        <div className="block sm:hidden">
                            {renderMobileLeaderboard()}
                        </div>
                    </div>
                </main>
            </div>

            {/* Bottom Navigation - Mobile Only */}
            <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 shadow-lg backdrop-blur-md lg:hidden">
                <div className="max-w-7xl mx-auto flex justify-around">
                    <a
                        href={getRoute('student.training')}
                        className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
                    >
                        <svg className="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                        <span className="text-xs">Training</span>
                    </a>
                    <a
                        href={getRoute('student.dashboard')}
                        className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
                    >
                        <svg className="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs">Home</span>
                    </a>
                    <a
                        href={getRoute('leaderboard.consistency')}
                        className="flex flex-col items-center py-3 px-4 text-[#7c3aed] border-t-2 border-[#7c3aed]"
                    >
                        <svg className="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 20h20M5 20V13M10 20V10M15 20v-8M20 20V4"></path>
                        </svg>
                        <span className="text-xs">Consistency</span>
                    </a>
                </div>
            </div>

            <style>
                {`
                @keyframes scale-in {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @media screen and (min-width: 375px) and (max-width: 414px) {
                    /* iPhone XR specific optimizations */
                    .max-w-md {
                        max-width: 100%;
                    }

                    /* Adjust padding for iPhone XR */
                    main {
                        padding-left: 16px;
                        padding-right: 16px;
                    }

                    /* Make buttons more touch-friendly */
                    button, a {
                        min-height: 44px;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default ConsistencyLeaderboard;
