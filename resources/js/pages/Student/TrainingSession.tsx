import { Head, useForm } from '@inertiajs/react';
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
    ArrowLeft
} from 'lucide-react';

interface SessionData {
    session_number?: string | number;
    week_number?: string | number;
    block_number?: string | number;
    id?: string | number;
}

interface TrainingSessionProps {
    session?: SessionData;
    existingResult: any | null;
    username?: string;
    routes?: {
        [key: string]: string;
    };
}

const TrainingSession: React.FC<TrainingSessionProps> = ({
    session = {},
    existingResult = null,
    username = 'Athlete',
    routes = {}
}) => {
    // Try to get session ID from URL if it's not in props
    const url = window.location.pathname;
    const urlSessionId = url.split('/').pop();

    console.log('Session from props:', session);
    console.log('Session ID from URL:', urlSessionId);

    // Add defaults in case session is undefined
    const sessionData: SessionData = session || {};
    const sessionNumber = sessionData.session_number || 'Unknown';
    const weekNumber = sessionData.week_number || 'Unknown';
    const blockNumber = sessionData.block_number || 'Unknown';

    // Try to get sessionId from multiple sources
    let sessionId = '';
    if (sessionData.id) {
        sessionId = sessionData.id.toString();
    } else if (urlSessionId) {
        sessionId = urlSessionId;
    }

    console.log('Final sessionId to be used:', sessionId);

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

    // Form handling
    const { data, setData, post, processing, errors } = useForm({
        warmup_completed: existingResult ? existingResult.warmup_completed : 'NO',
        plyometrics_score: existingResult ? existingResult.plyometrics_score : '',
        power_score: existingResult ? existingResult.power_score : '',
        lower_body_strength_score: existingResult ? existingResult.lower_body_strength_score : '',
        upper_body_core_strength_score: existingResult ? existingResult.upper_body_core_strength_score : '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // For debugging
        console.log('Form submitted', data);
        console.log('Using sessionId:', sessionId);

        if (sessionId) {
            post(`/training/session/${sessionId}/save`, {
                onSuccess: () => {
                    console.log('Form submitted successfully');
                },
                onError: (errors) => {
                    console.error('Form submission errors:', errors);
                },
            });
        } else {
            console.error('No session ID available');

            // Fallback approach - try to submit anyway using the URL path
            if (urlSessionId) {
                console.log('Trying fallback with URL session ID');
                post(`/training/session/${urlSessionId}/save`);
            }
        }
    };

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Get route helper function
    const getRoute = (name: string, params?: Record<string, string | number> | undefined): string => {
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
            <Head title={`Training Session ${sessionNumber}`} />

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
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
                        <div className="flex items-center">
                            <button onClick={toggleSidebar} className="mr-4 text-[#a3c0e6] hover:text-white lg:hidden">
                                <Menu className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Session {sessionNumber}</h1>
                                <p className="text-[#a3c0e6]">
                                    Block {blockNumber} - Week {weekNumber}
                                </p>
                            </div>
                        </div>
                        {existingResult && <div className="rounded-full bg-[#1e3a5f] px-3 py-1 text-sm font-medium text-[#4a90e2]">Completed</div>}
                    </div>
                </header>

                {/* Main Content */}
                <main ref={mainContentRef} className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-6">
                    <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                    Did you complete the warm up?
                                </label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setData('warmup_completed', 'YES')}
                                        className={`rounded-lg px-4 py-2 transition-colors ${
                                            data.warmup_completed === 'YES' ? 'bg-green-600 text-white' : 'bg-[#1e3a5f] text-[#a3c0e6] hover:bg-[#2a4a70]'
                                        }`}
                                    >
                                        YES
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('warmup_completed', 'NO')}
                                        className={`rounded-lg px-4 py-2 transition-colors ${
                                            data.warmup_completed === 'NO' ? 'bg-red-600 text-white' : 'bg-[#1e3a5f] text-[#a3c0e6] hover:bg-[#2a4a70]'
                                        }`}
                                    >
                                        NO
                                    </button>
                                </div>
                                {errors.warmup_completed && <p className="mt-1 text-sm text-red-400">{errors.warmup_completed}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                    PLYOMETRICS – What was your best score?
                                </label>
                                <input
                                    type="text"
                                    value={data.plyometrics_score}
                                    onChange={(e) => setData('plyometrics_score', e.target.value)}
                                    className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                    placeholder="Enter your score"
                                />
                                {errors.plyometrics_score && <p className="mt-1 text-sm text-red-400">{errors.plyometrics_score}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                    POWER – What was your best score/level?
                                </label>
                                <input
                                    type="text"
                                    value={data.power_score}
                                    onChange={(e) => setData('power_score', e.target.value)}
                                    className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                    placeholder="Enter your score/level"
                                />
                                {errors.power_score && <p className="mt-1 text-sm text-red-400">{errors.power_score}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                    LOWER BODY STRENGTH – What was your best score?
                                </label>
                                <input
                                    type="text"
                                    value={data.lower_body_strength_score}
                                    onChange={(e) => setData('lower_body_strength_score', e.target.value)}
                                    className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                    placeholder="Enter your score"
                                />
                                {errors.lower_body_strength_score && <p className="mt-1 text-sm text-red-400">{errors.lower_body_strength_score}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                    UPPER BODY/CORE STRENGTH – What was your best score?
                                </label>
                                <input
                                    type="text"
                                    value={data.upper_body_core_strength_score}
                                    onChange={(e) => setData('upper_body_core_strength_score', e.target.value)}
                                    className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                    placeholder="Enter your score"
                                />
                                {errors.upper_body_core_strength_score && (
                                    <p className="mt-1 text-sm text-red-400">{errors.upper_body_core_strength_score}</p>
                                )}
                            </div>

                            <div className="flex justify-between pt-4">
                                <a
                                    href={getRoute('student.training')}
                                    className="inline-flex items-center rounded-lg border border-[#1e3a5f] bg-transparent px-4 py-2 text-sm font-medium text-[#a3c0e6] shadow-sm transition-colors hover:bg-[#1e3a5f]"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Training
                                </a>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center rounded-lg bg-[#4a90e2] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3a80d2] focus:outline-none disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : existingResult ? 'Update Results' : 'Save Results'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            {/* Bottom Navigation - Mobile Only */}
            <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 shadow-lg backdrop-blur-md lg:hidden">
                <div className="flex justify-around">
                    <a
                        href={getRoute('student.training')}
                        className="flex flex-col items-center border-t-2 border-[#4a90e2] px-4 py-3 text-[#4a90e2]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mb-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs">Training</span>
                    </a>
                    <a
                        href={getRoute('student.dashboard')}
                        className="flex flex-col items-center px-4 py-3 text-[#a3c0e6] transition-colors hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mb-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
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

export default TrainingSession;
