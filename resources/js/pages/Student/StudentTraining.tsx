import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    Activity,
    Award,
    BarChart2,
    Calendar,
    Home,
    LogOut,
    Menu,
    Trophy,
    User,
    X,
} from 'lucide-react';

interface Session {
    id: number;
    session_number: number | null;
    session_type: 'training' | 'testing' | 'rest';
    is_completed: boolean;
    label: string;
}

interface Week {
    week_number: number;
    sessions: Session[];
}

interface Block {
    id: number;
    block_number: number;
    weeks: Week[];
}

interface StudentTrainingProps {
    blocks: Block[];
    username?: string;
    routes?: {
        [key: string]: string;
    };
}

const StudentTraining: React.FC<StudentTrainingProps> = ({
    blocks,
    username = 'Athlete',
    routes = {}
}) => {
    const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
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

    const toggleBlock = (blockId: number) => {
        if (expandedBlock === blockId) {
            setExpandedBlock(null);
        } else {
            setExpandedBlock(blockId);
        }
    };

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Get route helper function
    const getRoute = (name: string, params?: any): string => {
        // Check if routes object exists and contains the route
        if (routes && routes[name]) {
            return routes[name];
        }

        // Check if window.route function is available (Ziggy)
        if (typeof window !== 'undefined' && window.route && typeof window.route === 'function') {
            try {
                return window.route(name, params);
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
        };

        return fallbackRoutes[name] || '#';
    };

    return (
        <div ref={pageRef} className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            <Head title="Your Training" />

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
                        className="group flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white"
                    >
                        <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Training</span>
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
                            className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/50"
                        >
                            <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
                            <span className="group-hover:text-white">Consistency</span>
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
                        className="flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white"
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
                            className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
                        >
                            <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2]" />
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
                    <div className="mx-auto flex items-center justify-between">
                        <div className="flex items-center">
                            <button onClick={toggleSidebar} className="mr-4 text-[#a3c0e6] hover:text-white lg:hidden">
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed] lg:hidden">
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
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">Your Training</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main ref={mainContentRef} className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-6">
                    {blocks.length === 0 ? (
                        <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 text-center shadow-lg">
                            <p className="text-[#a3c0e6]">No training blocks available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {blocks.map((block) => (
                                <div key={block.id} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                                    <button
                                        onClick={() => toggleBlock(block.id)}
                                        className="w-full border-b border-[#1e3a5f] px-4 py-5 text-left font-medium text-white transition-colors hover:bg-[#1a3456] focus:outline-none"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a5f]">
                                                    <Calendar className="h-4 w-4 text-[#4a90e2]" />
                                                </div>
                                                <span>Block {block.block_number}</span>
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 text-[#4a90e2] transition-transform duration-200 ${expandedBlock === block.id ? 'rotate-180 transform' : ''}`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </button>

                                    {expandedBlock === block.id && (
                                        <div className="divide-y divide-[#1e3a5f] px-4 py-4">
                                            {block.weeks.map((week) => (
                                                <div key={week.week_number} className="py-4">
                                                    <h3 className="mb-3 text-lg font-medium text-white">Week {week.week_number}</h3>
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        {week.sessions.map((session) => (
                                                            <div
                                                                key={session.id}
                                                                className={`rounded-lg p-4 ${
                                                                    session.session_type === 'testing'
                                                                        ? 'border border-[#b59e00] bg-[#332b00]'
                                                                        : session.session_type === 'rest'
                                                                          ? 'border border-[#1e3a5f] bg-[#1e3a5f]/40'
                                                                          : session.is_completed
                                                                            ? 'border border-[#34d27b] bg-[#0a2e1a]'
                                                                            : 'border border-[#4a90e2] bg-[#0a1e3c]'
                                                                }`}
                                                            >
                                                                {session.session_type !== 'rest' ? (
                                                                    <a
                                                                        href={getRoute('training.session.show', { sessionId: session.id })}
                                                                        className="block w-full text-white transition-colors hover:text-[#63b3ed]"
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <span>{session.label}</span>
                                                                            {session.is_completed && (
                                                                                <span className="ml-2 inline-flex items-center rounded-full bg-[#34d27b]/20 px-2 py-1 text-xs font-medium text-[#34d27b]">
                                                                                    Completed
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </a>
                                                                ) : (
                                                                    <span className="block w-full cursor-default text-[#a3c0e6]">{session.label}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Bottom Navigation - Mobile Only */}
            <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 shadow-lg backdrop-blur-md lg:hidden">
                <div className="mx-auto flex max-w-7xl justify-around">
                    <a
                        href={getRoute('student.training')}
                        className="flex flex-col items-center border-t-2 border-[#4a90e2] px-4 py-3 text-[#4a90e2]"
                    >
                        <svg
                            className="mb-1 h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                        <span className="text-xs">Training</span>
                    </a>
                    <a
                        href={getRoute('student.dashboard')}
                        className="flex flex-col items-center px-4 py-3 text-[#a3c0e6] transition-colors hover:text-white"
                    >
                        <svg
                            className="mb-1 h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs">Home</span>
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

export default StudentTraining;
