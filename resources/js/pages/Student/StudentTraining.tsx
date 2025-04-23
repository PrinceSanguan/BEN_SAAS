import { Head, Link } from '@inertiajs/react';
import gsap from 'gsap';
import {
    Activity,
    Award,
    BarChart2,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    Home,
    Lock,
    LogOut,
    Menu,
    TrendingUp,
    Trophy,
    User,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Session {
    id: number;
    session_number: number | null;
    session_type: 'training' | 'testing' | 'rest';
    is_completed: boolean;
    is_locked: boolean;
    label: string;
    release_date: string; // Added release date
    raw_release_date: string | null; // For date comparison
}

interface Week {
    week_number: number;
    label: string;
    sessions: Session[];
}

interface Block {
    id: number;
    block_number: number;
    block_label: string;
    weeks: Week[];
}

interface StudentTrainingProps {
    blocks: Block[];
    username?: string;
    routes?: { [key: string]: string };
    currentDate: string; // Added current date
}

const StudentTraining: React.FC<StudentTrainingProps> = ({ blocks, username = 'Athlete', routes = {}, currentDate }) => {
    const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
    const [expandedWeeks, setExpandedWeeks] = useState<{ [blockId: number]: number[] }>({});
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Refs for GSAP animations
    const pageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    // Responsive check
    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Auto-expand the first block on initial load
    useEffect(() => {
        if (blocks.length > 0) {
            setExpandedBlock(blocks[0].id);

            // Also expand the first week of the first block
            if (blocks[0].weeks.length > 0) {
                setExpandedWeeks({ [blocks[0].id]: [blocks[0].weeks[0].week_number] });
            }
        }
    }, [blocks]);

    // GSAP animations
    useEffect(() => {
        if (isMobile) return;
        const tl = gsap.timeline({ delay: 0.1 });
        if (pageRef.current) {
            tl.from(pageRef.current, { opacity: 0.8, duration: 0.5, ease: 'power2.out' });
        }
        if (headerRef.current) {
            tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.2');
        }
        if (sidebarRef.current) {
            tl.from(sidebarRef.current, { x: -30, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
        }
        if (mainContentRef.current) {
            tl.from(mainContentRef.current, { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
        }
    }, [isMobile]);

    // Toggle dropdown for a block
    const toggleBlock = (blockId: number) => {
        setExpandedBlock(expandedBlock === blockId ? null : blockId);
    };

    // Toggle dropdown for a week within a block
    const toggleWeek = (blockId: number, weekNumber: number) => {
        setExpandedWeeks((prev) => {
            const currentWeeks = prev[blockId] || [];
            if (currentWeeks.includes(weekNumber)) {
                return { ...prev, [blockId]: currentWeeks.filter((w) => w !== weekNumber) };
            }
            return { ...prev, [blockId]: [...currentWeeks, weekNumber] };
        });
    };

    // Add these helper functions after state declarations
    const getCompletedSessionCount = (block: Block): number => {
        return block.weeks.reduce((count, week) => count + week.sessions.filter((session) => session.is_completed).length, 0);
    };

    const getAvailableSessionCount = (block: Block): number => {
        return block.weeks.reduce((count, week) => count + week.sessions.filter((session) => !session.is_locked).length, 0);
    };

    const getRemainingSessionCount = (block: Block): number => {
        const completed = getCompletedSessionCount(block);
        const available = getAvailableSessionCount(block);
        return available - completed;
    };

    // Add this filter before the return statement
    const visibleBlocks = blocks.filter((block, index) => {
        // Always show first block
        if (index === 0) return true;

        // Show second block only when first block has 1 remaining session
        if (index === 1) {
            return blocks.length > 0 && getRemainingSessionCount(blocks[0]) === 1;
        }

        // Show third block only when second block has 1 remaining session
        if (index === 2) {
            return blocks.length > 1 && getRemainingSessionCount(blocks[1]) === 1;
        }

        return false;
    });

    // Helper to check if a date is today
    const isToday = (dateStr: string): boolean => {
        if (!dateStr || dateStr === 'Not scheduled') return false;
        return dateStr === currentDate;
    };

    // Helper to check if a date is upcoming
    const isUpcoming = (rawDate: string | null): boolean => {
        if (!rawDate) return false;
        const sessionDate = new Date(rawDate);
        const today = new Date();

        // Reset time components for comparison
        today.setHours(0, 0, 0, 0);
        sessionDate.setHours(0, 0, 0, 0);

        return sessionDate > today;
    };

    // Helper to generate route URLs
    const getRoute = (name: string, params?: Record<string, string | number>): string => {
        if (routes && routes[name]) return routes[name];
        if (typeof window !== 'undefined' && window.route && typeof window.route === 'function') {
            try {
                return window.route(name, params);
            } catch (e) {
                console.error('Error using window.route:', e);
            }
        }
        const fallbackRoutes: Record<string, string> = {
            'student.dashboard': '/dashboard',
            'student.training': '/training',
            'training.session.show': '/training/session', // Your route should accept a sessionId
            'leaderboard.strength': '/leaderboard/strength',
            'leaderboard.consistency': '/leaderboard/consistency',
            'admin.logout': '/logout',
        };
        return params?.sessionId ? `${fallbackRoutes[name]}/${params.sessionId}` : fallbackRoutes[name] || '#';
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Function to display session label correctly
    const getSessionDisplayLabel = (session: Session) => {
        // Use the label from backend if available
        if (session.label) return session.label;

        // Fallback logic if label is not available
        if (session.session_type === 'testing') {
            return 'TESTING';
        } else if (session.session_type === 'rest') {
            return 'REST WEEK';
        } else {
            return `Session ${session.session_number}`;
        }
    };

    // Function to get session class based on type and status
    const getSessionClass = (session: Session) => {
        if (session.is_locked) {
            return 'border-gray-600 bg-[#0a1e3c]/50 opacity-70';
        } else if (session.session_type === 'testing') {
            return 'border-yellow-500 bg-[#1e3a5f]';
        } else if (session.session_type === 'rest') {
            return 'border-green-500 bg-[#112845]';
        } else {
            return 'border-gray-500 bg-[#0a1e3c]';
        }
    };

    // Get week status for visual indicator
    const getWeekStatus = (week: Week) => {
        const allCompleted = week.sessions.length > 0 && week.sessions.every((s) => s.is_completed);
        const someCompleted = week.sessions.some((s) => s.is_completed);

        if (allCompleted) return 'complete';
        if (someCompleted) return 'in-progress';
        return 'not-started';
    };

    // Function to render the session content with release date information
    const renderSessionContent = (session: Session) => {
        if (session.is_locked) {
            return (
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-gray-400">
                        <span>{getSessionDisplayLabel(session)}</span>
                        <Lock className="h-4 w-4" />
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Available: {session.release_date}</span>
                    </div>
                </div>
            );
        }

        if (session.session_type !== 'rest') {
            return (
                <a href={getRoute('training.session.show', { sessionId: session.id })} className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{getSessionDisplayLabel(session)}</span>
                        {session.is_completed ? (
                            <span className="inline-flex items-center rounded-full bg-green-200 px-2 py-1 text-xs font-medium text-green-700">
                                Completed
                            </span>
                        ) : isToday(session.release_date) ? (
                            <span className="inline-flex items-center rounded-full bg-blue-200 px-2 py-1 text-xs font-medium text-blue-700">
                                Today
                            </span>
                        ) : null}
                    </div>
                    <div className="flex items-center text-xs text-[#a3c0e6]">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>Released: {session.release_date}</span>
                    </div>
                </a>
            );
        } else {
            return (
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{getSessionDisplayLabel(session)}</span>
                        <span className="inline-flex items-center rounded-full bg-green-200/70 px-2 py-1 text-xs font-medium text-green-700">
                            Recovery
                        </span>
                    </div>
                    <div className="flex items-center text-xs text-[#a3c0e6]">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>Released: {session.release_date}</span>
                    </div>
                </div>
            );
        }
    };

    return (
        <div ref={pageRef} className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            <Head title="Your Training" />

            {/* Sidebar (Desktop) */}
            <div ref={sidebarRef} className="fixed z-30 hidden h-full border-r border-[#1e3a5f] bg-[#0a1e3c] lg:flex lg:w-64 lg:flex-col">
                <div className="flex h-16 items-center border-b border-[#1e3a5f] px-6">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                        <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white">AthleteTrack</h1>
                </div>
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
                <nav className="flex-1 space-y-1 px-2 py-4">
                    <a
                        href={getRoute('student.dashboard')}
                        className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
                    >
                        <Home className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
                        <span className="group-hover:text-white">Dashboard</span>
                    </a>
                    <a href={getRoute('student.training')} className="group flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white">
                        <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Training</span>
                    </a>
                    <a
                        href={getRoute('student.progress')}
                        className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/40 hover:text-white"
                    >
                        <TrendingUp className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Progress</span>
                    </a>
                    <div className="mt-4 border-t border-[#1e3a5f] pt-4">
                        <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-[#a3c0e6] uppercase">Leaderboards</h3>
                        <a
                            href={getRoute('leaderboard.strength')}
                            className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
                        >
                            <Award className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
                            <span className="group-hover:text-white">Strength</span>
                        </a>
                        <a
                            href={getRoute('leaderboard.consistency')}
                            className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
                        >
                            <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
                            <span className="group-hover:text-white">Consistency</span>
                        </a>
                    </div>
                </nav>
                <div className="border-t border-[#1e3a5f] p-4">
                    <Link
                        href={getRoute('admin.logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#112845] hover:text-white"
                        preserveScroll
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={toggleSidebar}></div>}

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-[#1e3a5f] bg-[#0a1e3c] transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
                <nav className="flex-1 space-y-1 px-2 py-4">
                    <a href={getRoute('student.dashboard')} className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50">
                        <Home className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Dashboard</span>
                    </a>
                    <a href={getRoute('student.training')} className="flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white">
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
                <div className="border-t border-[#1e3a5f] p-4">
                    <Link
                        href={getRoute('admin.logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#112845] hover:text-white"
                        preserveScroll
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </Link>
                </div>
            </div>

            {/* Main Content: Schedule */}
            <div className="flex-1 lg:ml-64">
                <header ref={headerRef} className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/90 px-4 py-4 backdrop-blur-md">
                    <div className="mx-auto flex items-center justify-between px-2 sm:px-4">
                        <div className="flex items-center">
                            <button onClick={toggleSidebar} className="mr-3 text-[#a3c0e6] hover:text-white lg:hidden">
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-xl font-bold text-white">Your Training</h1>
                        </div>
                        <div className="flex items-center text-xs text-[#a3c0e6] md:text-sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Today: {currentDate}</span>
                        </div>
                    </div>
                </header>
                <main ref={mainContentRef} className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
                    {blocks.length === 0 ? (
                        <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 text-center shadow-lg">
                            <p className="text-[#a3c0e6]">No training blocks available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {visibleBlocks.map((block) => (
                                <div key={block.id} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845]/90 shadow-lg">
                                    <button
                                        onClick={() => toggleBlock(block.id)}
                                        className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
                                    >
                                        <div className="flex items-center">
                                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f]">
                                                <Calendar className="h-5 w-5 text-[#4a90e2]" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white">{block.block_label}</h2>
                                        </div>
                                        {expandedBlock === block.id ? (
                                            <ChevronUp className="h-6 w-6 text-[#a3c0e6]" />
                                        ) : (
                                            <ChevronDown className="h-6 w-6 text-[#a3c0e6]" />
                                        )}
                                    </button>
                                    {expandedBlock === block.id && (
                                        <div className="divide-y divide-[#1e3a5f]">
                                            {block.weeks.map((week) => {
                                                const weekStatus = getWeekStatus(week);
                                                let statusColor = '';

                                                if (weekStatus === 'complete') statusColor = 'bg-green-500';
                                                else if (weekStatus === 'in-progress') statusColor = 'bg-yellow-500';
                                                else statusColor = 'bg-gray-500';

                                                return (
                                                    <div key={week.week_number} className="px-5 py-4">
                                                        <button
                                                            onClick={() => toggleWeek(block.id, week.week_number)}
                                                            className="flex w-full items-center justify-between text-left focus:outline-none"
                                                        >
                                                            <div className="flex items-center">
                                                                <div className={`h-3 w-3 rounded-full ${statusColor} mr-3`}></div>
                                                                <span className="font-medium text-white">Week {week.week_number}</span>
                                                            </div>
                                                            {expandedWeeks[block.id]?.includes(week.week_number) ? (
                                                                <ChevronUp className="h-5 w-5 text-[#a3c0e6]" />
                                                            ) : (
                                                                <ChevronDown className="h-5 w-5 text-[#a3c0e6]" />
                                                            )}
                                                        </button>
                                                        {expandedWeeks[block.id]?.includes(week.week_number) && (
                                                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                                {week.sessions.map((session) => (
                                                                    <div
                                                                        key={session.id}
                                                                        className={`rounded-lg border ${getSessionClass(session)} p-4 transition-colors hover:border-[#4a90e2]`}
                                                                    >
                                                                        {renderSessionContent(session)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Bottom Navigation - Mobile */}
            <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#1e3a5f] bg-[#0a1e3c]/95 shadow-lg backdrop-blur-md lg:hidden">
                <div className="mx-auto flex justify-around">
                    <a
                        href={getRoute('student.training')}
                        className="flex flex-col items-center border-t-2 border-[#4a90e2] px-5 py-3 text-[#4a90e2]"
                    >
                        <Activity className="mb-1 h-6 w-6" />
                        <span className="text-xs">Training</span>
                    </a>
                    <a
                        href={getRoute('student.dashboard')}
                        className="flex flex-col items-center px-5 py-3 text-[#a3c0e6] transition-colors hover:text-white"
                    >
                        <Home className="mb-1 h-6 w-6" />
                        <span className="text-xs">Home</span>
                    </a>
                    <a
                        href={getRoute('leaderboard.strength')}
                        className="flex flex-col items-center px-5 py-3 text-[#a3c0e6] transition-colors hover:text-white"
                    >
                        <Award className="mb-1 h-6 w-6" />
                        <span className="text-xs">Leaderboard</span>
                    </a>
                </div>
            </div>

            {/* Legend - shows what different colors and states mean */}
            <div className="fixed right-4 bottom-20 z-30 rounded-lg border border-[#1e3a5f] bg-[#0a1e3c]/90 p-3 text-xs shadow-lg backdrop-blur-md lg:bottom-4">
                <div className="flex flex-col space-y-2">
                    <h3 className="font-medium text-white">Legend:</h3>
                    <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-[#a3c0e6]">Completed</span>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span className="text-[#a3c0e6]">In Progress</span>
                    </div>
                    <div className="flex items-center">
                        <Lock className="mr-2 h-3 w-3 text-gray-400" />
                        <span className="text-[#a3c0e6]">Locked (not yet released)</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-3 w-3 text-blue-400" />
                        <span className="text-[#a3c0e6]">Today's session</span>
                    </div>
                </div>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
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

                /* Improve touch targets for mobile */
                @media (max-width: 768px) {
                    button,
                    a {
                        min-height: 44px;
                        padding: 0.75rem;
                    }

                    .sticky {
                        position: sticky;
                        top: 0;
                        z-index: 10;
                    }
                }
                `,
                }}
            />
        </div>
    );
};

export default StudentTraining;
