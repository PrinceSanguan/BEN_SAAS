import Sidebar from '@/components/Student/Sidebar';
import { Head, useForm } from '@inertiajs/react';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface SessionData {
    session_number?: string | number;
    week_number?: string | number;
    block_number?: string | number;
    id?: string | number;
    session_type?: string; // Added to distinguish testing sessions
}

interface TrainingSessionProps {
    session?: SessionData;
    existingResult: any | null;
    username?: string;
    routes?: {
        [key: string]: string;
    };
}

const TrainingSession: React.FC<TrainingSessionProps> = ({ session = {}, existingResult = null, username = 'Athlete', routes = {} }) => {
    // Try to get session ID from URL if not in props
    const url = window.location.pathname;
    const urlSessionId = url.split('/').pop();

    console.log('Session from props:', session);
    console.log('Session ID from URL:', urlSessionId);

    // Defaults
    const sessionData: SessionData = session || {};
    const sessionNumber = sessionData.session_number || 'Unknown';
    const weekNumber = sessionData.week_number || 'Unknown';
    const blockNumber = sessionData.block_number || 'Unknown';
    const isTesting = sessionData.session_type === 'testing';

    // Determine sessionId from props or URL
    let sessionId = '';
    if (sessionData.id) {
        sessionId = sessionData.id.toString();
    } else if (urlSessionId) {
        sessionId = urlSessionId;
    }

    console.log('Final sessionId to be used:', sessionId);

    // Responsive state and sidebar control
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Refs for GSAP animations
    const pageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;
        const animationTimeout = setTimeout(() => {
            const tl = gsap.timeline();
            if (pageRef.current) {
                tl.from(pageRef.current, {
                    opacity: 0.8,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            }
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
        return () => clearTimeout(animationTimeout);
    }, [isMobile]);

    // Setup form defaults based on session type
    const { data, setData, post, processing, errors } = useForm(
        isTesting
            ? {
                  standing_long_jump: existingResult ? existingResult.standing_long_jump : '',
                  single_leg_jump_left: existingResult ? existingResult.single_leg_jump_left : '',
                  single_leg_jump_right: existingResult ? existingResult.single_leg_jump_right : '',
                  single_leg_wall_sit_left: existingResult ? existingResult.single_leg_wall_sit_left : '',
                  single_leg_wall_sit_right: existingResult ? existingResult.single_leg_wall_sit_right : '',
                  core_endurance_left: existingResult ? existingResult.core_endurance_left : '',
                  core_endurance_right: existingResult ? existingResult.core_endurance_right : '',
                  bent_arm_hang_assessment: existingResult ? existingResult.bent_arm_hang_assessment : '',
              }
            : {
                  // training form fields remain the same
                  warmup_completed: existingResult ? existingResult.warmup_completed : 'NO',
                  plyometrics_score: existingResult ? existingResult.plyometrics_score : '',
                  power_score: existingResult ? existingResult.power_score : '',
                  lower_body_strength_score: existingResult ? existingResult.lower_body_strength_score : '',
                  upper_body_core_strength_score: existingResult ? existingResult.upper_body_core_strength_score : '',
              },
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            if (urlSessionId) {
                console.log('Trying fallback with URL session ID');
                post(`/training/session/${urlSessionId}/save`);
            }
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const getRoute = (name: string, params?: Record<string, string | number>): string => {
        if (routes && routes[name]) {
            return routes[name];
        }
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
            'leaderboard.strength': '/leaderboard/strength',
            'leaderboard.consistency': '/leaderboard/consistency',
        };
        return fallbackRoutes[name] || '#';
    };

    return (
        <div ref={pageRef} className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            <Head title={`Training Session ${sessionNumber}`} />

            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar username={username} routes={routes} currentRoute={window.location.pathname} />
            </div>

            <div className="flex-1 lg:ml-64">
                <header ref={headerRef} className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-4 py-4 backdrop-blur-md lg:px-8">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-4">
                        <div className="flex items-center">
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

                <main ref={mainContentRef} className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:px-8 lg:pb-6">
                    <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            {isTesting ? (
                                <>
                                    <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-900/30 p-4">
                                        <h3 className="mb-2 text-sm font-semibold text-blue-400">📝 Important Instructions:</h3>
                                        <ul className="space-y-1 text-xs text-gray-300">
                                            <li>
                                                • Enter all measurements as <strong>numbers only</strong>
                                            </li>
                                            <li>
                                                • Distance measurements: Use <strong>centimeters</strong> (e.g., 135)
                                            </li>
                                            <li>
                                                • Time measurements: Use <strong>seconds</strong> (e.g., 96 instead of 1m36s)
                                            </li>
                                            <li>• If you couldn't complete a test, leave it blank or enter 0</li>
                                            <li>• Do not enter text like "Was raining" - use the blank field instead</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            STANDING LONG JUMP – What was your best score? (cm)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={data.standing_long_jump}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Allow empty string or valid number
                                                if (value === '' || !isNaN(parseFloat(value))) {
                                                    setData('standing_long_jump', value);
                                                }
                                            }}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter distance in centimeters (e.g., 125)"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Enter numeric values only</p>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            SINGLE LEG JUMP (LEFT) – What was your best score?
                                        </label>
                                        <input
                                            type="text"
                                            value={data.single_leg_jump_left}
                                            onChange={(e) => setData('single_leg_jump_left', e.target.value)}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter your score"
                                        />
                                        {errors.single_leg_jump_left && <p className="mt-1 text-sm text-red-400">{errors.single_leg_jump_left}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            SINGLE LEG JUMP (RIGHT) – What was your best score?
                                        </label>
                                        <input
                                            type="text"
                                            value={data.single_leg_jump_right}
                                            onChange={(e) => setData('single_leg_jump_right', e.target.value)}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter your score"
                                        />
                                        {errors.single_leg_jump_right && <p className="mt-1 text-sm text-red-400">{errors.single_leg_jump_right}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            SINGLE LEG WALL SIT (LEFT) – What was your best score? (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            step="1"
                                            value={data.single_leg_wall_sit_left}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === '' || !isNaN(parseFloat(value))) {
                                                    setData('single_leg_wall_sit_left', value);
                                                }
                                            }}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter time in seconds (e.g., 45)"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">
                                            Enter time as total seconds, not minutes (e.g., 96 instead of 1m36s)
                                        </p>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            SINGLE LEG WALL SIT (RIGHT) – What was your best score?
                                        </label>
                                        <input
                                            type="text"
                                            value={data.single_leg_wall_sit_right}
                                            onChange={(e) => setData('single_leg_wall_sit_right', e.target.value)}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter your score"
                                        />
                                        {errors.single_leg_wall_sit_right && (
                                            <p className="mt-1 text-sm text-red-400">{errors.single_leg_wall_sit_right}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            CORE ENDURANCE (LEFT) – What was your best score? (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            step="1"
                                            value={data.core_endurance_left}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === '' || !isNaN(parseFloat(value))) {
                                                    setData('core_endurance_left', value);
                                                }
                                            }}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter time in seconds (e.g., 63)"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Enter time as total seconds</p>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            CORE ENDURANCE (RIGHT) – What was your best score?
                                        </label>
                                        <input
                                            type="text"
                                            value={data.core_endurance_right}
                                            onChange={(e) => setData('core_endurance_right', e.target.value)}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter your score"
                                        />
                                        {errors.core_endurance_right && <p className="mt-1 text-sm text-red-400">{errors.core_endurance_right}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            BENT ARM HANG ASSESSMENT – What was your best score? (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            step="1"
                                            value={data.bent_arm_hang_assessment}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === '' || !isNaN(parseFloat(value))) {
                                                    setData('bent_arm_hang_assessment', value);
                                                }
                                            }}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter time in seconds or leave blank if not performed"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Leave blank if unable to complete due to conditions</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            Did you complete the warm up?
                                        </label>
                                        <div className="flex space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setData('warmup_completed', 'YES')}
                                                className={`rounded-lg px-4 py-2 transition-colors ${
                                                    data.warmup_completed === 'YES'
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-[#1e3a5f] text-[#a3c0e6] hover:bg-[#2a4a70]'
                                                }`}
                                            >
                                                YES
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('warmup_completed', 'NO')}
                                                className={`rounded-lg px-4 py-2 transition-colors ${
                                                    data.warmup_completed === 'NO'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-[#1e3a5f] text-[#a3c0e6] hover:bg-[#2a4a70]'
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
                                            value={data.plyometrics_score || ''}
                                            onChange={(e) => {
                                                const value = e.target.value.trim();
                                                setData('plyometrics_score', value);
                                            }}
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
                                            value={data.power_score || ''}
                                            onChange={(e) => {
                                                const value = e.target.value.trim();
                                                setData('power_score', value);
                                            }}
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
                                            value={data.lower_body_strength_score || ''}
                                            onChange={(e) => {
                                                const value = e.target.value.trim();
                                                setData('lower_body_strength_score', value);
                                            }}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter your score"
                                        />
                                        {errors.lower_body_strength_score && (
                                            <p className="mt-1 text-sm text-red-400">{errors.lower_body_strength_score}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                            UPPER BODY/CORE STRENGTH – What was your best score?
                                        </label>
                                        <input
                                            type="text"
                                            value={data.upper_body_core_strength_score || ''}
                                            onChange={(e) => {
                                                // Ensure only valid string values are sent
                                                const value = e.target.value.trim();
                                                setData('upper_body_core_strength_score', value);
                                            }}
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-[#1e3a5f] bg-[#0a1e3c] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2]"
                                            placeholder="Enter your score"
                                        />
                                        {errors.upper_body_core_strength_score && (
                                            <p className="mt-1 text-sm text-red-400">{errors.upper_body_core_strength_score}</p>
                                        )}
                                    </div>
                                </>
                            )}

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
                    .max-w-md {
                        max-width: 100%;
                    }
                    main {
                        padding-left: 16px;
                        padding-right: 16px;
                    }
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
