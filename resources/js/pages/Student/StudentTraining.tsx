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
import Layout from '@/components/Student/Layout';

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
    const navRef = useRef<HTMLElement>(null);

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
        // Check if this is a rest week (weeks 7 and 14)
        const isRestWeek = week.week_number === 7 || week.week_number === 14;

        if (isRestWeek) return 'rest';

        const allCompleted = week.sessions.length > 0 && week.sessions.every((s) => s.is_completed);
        const someCompleted = week.sessions.some((s) => s.is_completed);

        if (allCompleted) return 'complete';
        if (someCompleted) return 'in-progress';
        return 'not-started';
    };

    // Function to render the session content with release date information
    const renderSessionContent = (session: Session) => {
        if (session.session_type === 'rest') {
            return (
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-white">REST WEEK</span>
                        <span className="inline-flex items-center rounded-full bg-blue-200/70 px-2 py-1 text-xs font-medium text-blue-700">
                            Recovery
                        </span>
                    </div>
                    <div className="flex items-center text-xs text-[#a3c0e6]">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>Week: {session.release_date}</span>
                    </div>
                </div>
            );
        }

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

        return (
            <a href={getRoute('training.session.show', { sessionId: session.id })} className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{getSessionDisplayLabel(session)}</span>
                    {session.is_completed ? (
                        <span className="inline-flex items-center rounded-full bg-green-200 px-2 py-1 text-xs font-medium text-green-700">
                            Completed
                        </span>
                    ) : isToday(session.release_date) ? (
                        <span className="inline-flex items-center rounded-full bg-blue-200 px-2 py-1 text-xs font-medium text-blue-700">Today</span>
                    ) : null}
                </div>
                <div className="flex items-center text-xs text-[#a3c0e6]">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>Released: {session.release_date}</span>
                </div>
            </a>
        );
    };

    // Mobile view
    if (isMobile) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a] px-4 py-6">
                <Head title="Your Training" />

                {/* Mobile view content... */}
                {/* ... existing mobile content ... */}
            </div>
        );
    }

    // Desktop view with Layout
    return (
        <Layout username={username} routes={routes} pageTitle="Your Training">
            <Head title="Your Training" />

            <div className="flex items-center justify-end text-xs text-[#a3c0e6] md:text-sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Today: {currentDate}</span>
                        </div>

                    {blocks.length === 0 ? (
                        <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 text-center shadow-lg">
                            <p className="text-[#a3c0e6]">No training blocks available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {blocks.map((block) => (
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
                                                else if (weekStatus === 'rest') statusColor = 'bg-blue-500';
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

            {/* Legend - shows what different colors and states mean */}
            <div className="fixed right-4 bottom-4 z-30 rounded-lg border border-[#1e3a5f] bg-[#0a1e3c]/90 p-3 text-xs shadow-lg backdrop-blur-md">
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
        </Layout>
    );
};

export default StudentTraining;
