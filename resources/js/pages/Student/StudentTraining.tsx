import Layout from '@/components/Student/Layout';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { Calendar, ChevronDown, ChevronUp, Clock, Lock } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Session {
    id: number;
    session_number: number | null;
    session_type: 'training' | 'testing' | 'rest';
    is_completed: boolean;
    is_locked: boolean;
    label: string;
    release_date: string;
    raw_release_date: string | null;
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
    currentDate: string;
}

const StudentTraining: React.FC<StudentTrainingProps> = ({ blocks, username = 'Athlete', routes = {}, currentDate }) => {
    const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
    const [expandedWeeks, setExpandedWeeks] = useState<{ [blockId: number]: number[] }>({});
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const pageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        if (blocks.length > 0) {
            setExpandedBlock(blocks[0].id);
            if (blocks[0].weeks.length > 0) {
                setExpandedWeeks({ [blocks[0].id]: [blocks[0].weeks[0].week_number] });
            }
        }
    }, [blocks]);

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

    const toggleBlock = (blockId: number) => {
        setExpandedBlock(expandedBlock === blockId ? null : blockId);
    };

    const toggleWeek = (blockId: number, weekNumber: number) => {
        setExpandedWeeks((prev) => {
            const currentWeeks = prev[blockId] || [];
            if (currentWeeks.includes(weekNumber)) {
                return { ...prev, [blockId]: currentWeeks.filter((w) => w !== weekNumber) };
            }
            return { ...prev, [blockId]: [...currentWeeks, weekNumber] };
        });
    };

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

    const isToday = (dateStr: string): boolean => {
        if (!dateStr || dateStr === 'Not scheduled') return false;
        return dateStr === currentDate;
    };

    const isUpcoming = (rawDate: string | null): boolean => {
        if (!rawDate) return false;
        const sessionDate = new Date(rawDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate > today;
    };

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
            'training.session.show': '/training/session',
            'leaderboard.strength': '/leaderboard/strength',
            'leaderboard.consistency': '/leaderboard/consistency',
            'admin.logout': '/logout',
        };
        return params?.sessionId ? `${fallbackRoutes[name]}/${params.sessionId}` : fallbackRoutes[name] || '#';
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const getSessionDisplayLabel = (session: Session) => {
        if (session.label) return session.label;
        if (session.session_type === 'testing') {
            return 'TESTING';
        } else if (session.session_type === 'rest') {
            return 'REST WEEK';
        } else {
            return `Session ${session.session_number}`;
        }
    };

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

    const getWeekStatus = (week: Week) => {
        const isRestWeek = week.week_number === 6 || week.week_number === 12;
        if (isRestWeek) return 'rest';
        const allCompleted = week.sessions.length > 0 && week.sessions.every((s) => s.is_completed);
        const someCompleted = week.sessions.some((s) => s.is_completed);
        if (allCompleted) return 'complete';
        if (someCompleted) return 'in-progress';
        return 'not-started';
    };

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

    return (
        <Layout username={username} routes={routes} pageTitle="Your Training">
            <Head title="Your Training" />

            <div className="mb-4 flex items-center justify-between lg:hidden">
                <button onClick={toggleSidebar} className="rounded-lg bg-[#1e3a5f] p-2 text-[#a3c0e6] hover:bg-[#2a4a70] hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white">Your Training</h1>
                <div></div>
            </div>

            <div className="flex items-center justify-end text-xs text-[#a3c0e6] md:text-sm">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Today: {currentDate}</span>
            </div>

            {blocks.length === 0 ? (
                <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 text-center shadow-lg">
                    <p className="text-[#a3c0e6]">No training blocks available yet.</p>
                </div>
            ) : (
                <div className="space-y-4 lg:space-y-6">
                    {blocks.map((block) => (
                        <div key={block.id} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845]/90 shadow-lg">
                            <button
                                onClick={() => toggleBlock(block.id)}
                                className="flex w-full items-center justify-between p-4 text-left focus:outline-none lg:p-5"
                            >
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a5f] lg:h-10 lg:w-10">
                                        <Calendar className="h-4 w-4 text-[#4a90e2] lg:h-5 lg:w-5" />
                                    </div>
                                    <h2 className="text-lg font-bold text-white lg:text-2xl">{block.block_label}</h2>
                                </div>
                                {expandedBlock === block.id ? (
                                    <ChevronUp className="h-5 w-5 text-[#a3c0e6] lg:h-6 lg:w-6" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-[#a3c0e6] lg:h-6 lg:w-6" />
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
                                            <div key={week.week_number} className="px-4 py-3 lg:px-5 lg:py-4">
                                                <button
                                                    onClick={() => toggleWeek(block.id, week.week_number)}
                                                    className="flex w-full items-center justify-between text-left focus:outline-none"
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`h-3 w-3 rounded-full ${statusColor} mr-3`}></div>
                                                        <span className="font-medium text-white">Week {week.week_number}</span>
                                                    </div>
                                                    {expandedWeeks[block.id]?.includes(week.week_number) ? (
                                                        <ChevronUp className="h-4 w-4 text-[#a3c0e6] lg:h-5 lg:w-5" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-[#a3c0e6] lg:h-5 lg:w-5" />
                                                    )}
                                                </button>
                                                {expandedWeeks[block.id]?.includes(week.week_number) && (
                                                    <div className="mt-3 space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                                                        {week.sessions.map((session) => (
                                                            <div
                                                                key={session.id}
                                                                className={`rounded-lg border ${getSessionClass(session)} p-3 transition-colors hover:border-[#4a90e2] lg:p-4`}
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

            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleSidebar}></div>
                    <div className="fixed top-0 left-0 h-full w-64 border-r border-[#1e3a5f] bg-[#0a1e3c] shadow-xl">
                        <div className="flex h-16 items-center justify-between border-b border-[#1e3a5f] px-6">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                                    <Calendar className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-white">AthleteTrack</h1>
                            </div>
                            <button onClick={toggleSidebar} className="text-[#a3c0e6] hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="border-b border-[#1e3a5f] p-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-[#4a90e2]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-white">{username}</h2>
                                    <p className="text-xs text-[#a3c0e6]">Athlete</p>
                                </div>
                            </div>
                        </div>
                        <nav className="space-y-1 p-4">
                            <a
                                href={getRoute('student.dashboard')}
                                className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/80 hover:text-white"
                                onClick={toggleSidebar}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 h-5 w-5 text-[#4a90e2]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                <span>Dashboard</span>
                            </a>
                            <a
                                href={getRoute('student.training')}
                                className="flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white"
                                onClick={toggleSidebar}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 h-5 w-5 text-[#4a90e2]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Training Diary</span>
                            </a>
                            <div className="pt-4">
                                <h3 className="px-4 py-2 text-xs font-semibold tracking-wider text-[#63b3ed] uppercase">Leaderboards</h3>
                                <a
                                    href={getRoute('leaderboard.strength')}
                                    className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/80 hover:text-white"
                                    onClick={toggleSidebar}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-3 h-5 w-5 text-[#4a90e2]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                        />
                                    </svg>
                                    <span>Strength</span>
                                </a>
                                <a
                                    href={getRoute('leaderboard.consistency')}
                                    className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/80 hover:text-white"
                                    onClick={toggleSidebar}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-3 h-5 w-5 text-[#4a90e2]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    <span>Consistency</span>
                                </a>
                            </div>
                        </nav>
                        <div className="absolute bottom-0 w-full border-t border-[#1e3a5f] p-4">
                            <a
                                href={getRoute('admin.logout')}
                                className="flex w-full items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#112845] hover:text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="z-30 mt-6 rounded-lg border border-[#1e3a5f] bg-[#0a1e3c]/90 p-3 text-xs shadow-lg lg:fixed lg:right-4 lg:bottom-4 lg:mt-0 lg:p-3 lg:backdrop-blur-md">
                <div className="space-y-2 lg:flex lg:flex-col lg:space-y-2">
                    <h3 className="mb-2 font-medium text-white lg:mb-0">Legend:</h3>
                    <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:space-y-2">
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
                            <span className="text-[#a3c0e6]">Locked</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-3 w-3 text-blue-400" />
                            <span className="text-[#a3c0e6]">Today</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentTraining;
