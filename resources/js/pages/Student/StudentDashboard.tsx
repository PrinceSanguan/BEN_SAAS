import { Link, router } from '@inertiajs/react';
import gsap from 'gsap';
import { Activity, Award, BarChart2, Calendar, Clock, Home, Lock, LogOut, TrendingUp, Trophy, User } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

// TypeScript interface for component props
interface StudentDashboardProps {
    username: string;
    strengthLevel: number;
    consistencyScore: number;
    currentRank?: number;
    blocks: Array<{
        is_locked: any;
        id: number;
        block_number: number;
        start_date: string;
        end_date: string;
        duration_weeks: number;
        is_current: boolean;
    }>;
    remainingSessions?: number; // Added prop for remaining sessions
    routes?: {
        [key: string]: string;
    };
    xpInfo?: {
        total_xp: number;
        current_level: number;
        next_level: number;
        xp_needed: number;
        progress_percentage: number;
        xp_for_current_level: number;
        xp_for_next_level: number;
        xp_gap: number;
    };
}

// CircularProgress component
const CircularProgress: React.FC<{
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    xpInfo?: any;
}> = ({ value, max, size = 120, strokeWidth = 8, xpInfo }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Calculate percentage directly from XP values instead of using progress_percentage
    let progressPercentage = 0;
    if (xpInfo && xpInfo.total_xp > 0) {
        // If we're at level 1 and need 3 XP to level 2, and we have 1 XP, we're 1/3 of the way there
        if (xpInfo.current_level === 1) {
            progressPercentage = xpInfo.total_xp / 3; // Directly calculate: 1/3 = 0.33
        } else {
            progressPercentage = xpInfo.progress_percentage / 100;
        }
    }

    const dashoffset = circumference * (1 - progressPercentage);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg className="absolute" width={size} height={size}>
                <circle
                    className="text-[#1e3a5f]"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            {/* Progress circle - CHANGED TO GREEN */}
            <svg className="absolute -rotate-90" width={size} height={size}>
                <circle
                    className="text-[#2ecc71]"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            {/* Center text */}
            <div className="absolute flex flex-col items-center justify-center">
                <div className="flex items-end">
                    <span className="text-3xl font-bold text-white">{value}</span>
                </div>
                <span className="text-xs text-[#a3c0e6]">LEVEL</span>
            </div>
        </div>
    );
};

// Mobile-only Circular Avatar component with unranked support
const CircularAvatar: React.FC<{ value: number; size?: number; strokeWidth?: number; xpInfo?: any }> = ({
    value,
    size = 120,
    strokeWidth = 3,
    xpInfo,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Calculate the proper progress percentage
    let progressPercentage = 0;
    if (xpInfo && xpInfo.total_xp > 0) {
        // Special calculation for level 1
        if (xpInfo.current_level === 1) {
            progressPercentage = xpInfo.total_xp / 3; // If we have 1 XP out of 3 needed, show 33.33%
        } else {
            progressPercentage = xpInfo.progress_percentage / 100;
        }
    }

    const dashoffset = circumference * (1 - progressPercentage);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg className="absolute" width={size} height={size}>
                <circle
                    className="text-[#1e3a5f]"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            {/* Progress circle - CHANGED TO GREEN */}
            <svg className="absolute -rotate-90" width={size} height={size}>
                <circle
                    className="text-[#2ecc71]"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            {/* Avatar placeholder */}
            <div className="z-10 flex h-3/4 w-3/4 items-center justify-center rounded-full bg-[#112845]">
                <User className="h-1/2 w-1/2 text-[#4a90e2]" />
            </div>
        </div>
    );
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({
    username,
    strengthLevel,
    consistencyScore,
    currentRank = 0,
    blocks = [], // Provide default empty array to prevent issues
    remainingSessions = 0, // Default to 0 if not provided
    routes = {}, // Default to empty object if routes is not provided
    xpInfo, // Add xpInfo to the destructured props
}) => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<{
        id: number;
        block_number: number;
        start_date: string;
        end_date: string;
        duration_weeks: number;
        is_current: boolean;
        is_associated_with_user?: boolean;
    } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Debug routes in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Routes received:', routes);
        }
    }, [routes]);

    // Sequential block unlocking based on current block and remaining sessions
    const visibleBlocks = blocks
        .filter((block) => {
            // For now, return all blocks and let the backend handle the filtering
            return true;
        })
        .map((block) => ({
            ...block,
            is_locked: block.is_locked, // Keep the is_locked status from backend
        }));

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

    // Use hardcoded fallback routes if not provided in props
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
            'student.progress': '/progress', // Uncommented progress route
            'student.settings': '/settings',
            'leaderboard.strength': '/leaderboard/strength',
            'leaderboard.consistency': '/leaderboard/consistency',
        };

        return fallbackRoutes[name] || '#';
    };

    // Refs for GSAP animations
    const pageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const strengthRef = useRef<SVGCircleElement>(null);
    const consistencyRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const mobileCardRef = useRef<HTMLDivElement>(null);
    const mobileAvatarRef = useRef<HTMLDivElement>(null);

    // GSAP animations
    useEffect(() => {
        // Skip animations on mobile for original layout
        if (isMobile) {
            // Mobile animations
            const tl = gsap.timeline();

            if (pageRef.current) {
                tl.from(pageRef.current, {
                    opacity: 0.8,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            }

            if (mobileCardRef.current) {
                tl.from(
                    mobileCardRef.current,
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                    },
                    '-=0.2',
                );
            }

            if (mobileAvatarRef.current) {
                tl.from(
                    mobileAvatarRef.current,
                    {
                        scale: 0.9,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'back.out(1.7)',
                    },
                    '-=0.2',
                );
            }

            return;
        }

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

            // Circular progress animation with XP check
            if (strengthRef.current) {
                const radius = strengthRef.current.r.baseVal.value;
                const circumference = radius * 2 * Math.PI;
                const hasXp = xpInfo && xpInfo.total_xp > 0;

                gsap.fromTo(
                    strengthRef.current,
                    {
                        strokeDashoffset: circumference,
                    },
                    {
                        strokeDashoffset: hasXp ? circumference * (1 - xpInfo.progress_percentage / 100) : circumference,
                        duration: 1.5,
                        ease: 'power2.inOut',
                    },
                );
            }

            // Consistency bar animation
            if (consistencyRef.current) {
                tl.from(
                    consistencyRef.current,
                    {
                        width: 0,
                        duration: 0.8,
                        ease: 'power2.inOut',
                    },
                    '-=0.1',
                );
            }
        }, 100);

        return () => {
            clearTimeout(animationTimeout);
        };
    }, [isMobile, strengthLevel, xpInfo]);

    // Function to handle block click - Show the modal
    const handleBlockClick = (block: {
        id: number;
        block_number: number;
        start_date: string;
        end_date: string;
        duration_weeks: number;
        is_current: boolean;
    }) => {
        setSelectedBlock(block);
        setShowPrompt(true);
    };

    const closePrompt = () => {
        setShowPrompt(false);
        setSelectedBlock(null);
    };

    const goToTraining = () => {
        // Safe navigation with fallback
        const trainingUrl = getRoute('student.training');
        router.visit(trainingUrl);
    };

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Get current block if any
    const currentBlock = blocks.find((block) => block.is_current);

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Check if player has XP
    const hasXp = xpInfo && xpInfo.total_xp > 0;

    // Render mobile layout based on wireframe
    if (isMobile) {
        return (
            <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a] px-4 py-6">
                {/* Header with title */}
                <div className="mb-6 w-full text-center">
                    <h1 className="text-2xl font-bold text-white">Home</h1>
                </div>

                {/* Main content card */}
                <div ref={mobileCardRef} className="mx-auto w-full max-w-md rounded-lg border border-[#1e3a5f] bg-[#112845] p-6 shadow-lg">
                    {/* Avatar and level section */}
                    <div ref={mobileAvatarRef} className="mb-8 flex flex-col items-center">
                        <CircularAvatar value={strengthLevel} size={120} xpInfo={xpInfo} />

                        {/* User info grid */}
                        <div className="mt-6 grid w-full grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-[#a3c0e6]">Athlete Name:</p>
                                <p className="font-medium text-white">{username}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#a3c0e6]">Level:</p>
                                <p className="font-medium text-white">{strengthLevel}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#a3c0e6]">Consistency Score:</p>
                                <p className="font-medium text-white">{consistencyScore}%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#a3c0e6]">Rank:</p>
                                <p className="font-medium text-white">{hasXp ? `#${currentRank}` : 'Unranked'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard links */}
                    <div className="mb-8 space-y-3">
                        <Link
                            href={getRoute('leaderboard.strength')}
                            className="flex w-full items-center justify-center rounded-md border border-[#1e3a5f] bg-[#0a1e3c] py-3 text-center font-medium text-[#a3c0e6] shadow-md hover:bg-[#1e3a5f]/50"
                        >
                            <Award className="mr-2 h-5 w-5 text-[#4a90e2]" />
                            Athlete Level Leaderboard
                        </Link>
                        <Link
                            href={getRoute('leaderboard.consistency')}
                            className="flex w-full items-center justify-center rounded-md border border-[#1e3a5f] bg-[#0a1e3c] py-3 text-center font-medium text-[#a3c0e6] shadow-md hover:bg-[#1e3a5f]/50"
                        >
                            <BarChart2 className="mr-2 h-5 w-5 text-[#4a90e2]" />
                            Consistency Leaderboard
                        </Link>
                    </div>

                    {/* Bottom navigation */}
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href={getRoute('student.dashboard')}
                            className="flex flex-col items-center rounded-md bg-[#1e3a5f] p-3 text-center text-white hover:bg-[#1e3a5f]/80"
                        >
                            <Home className="mb-1 h-6 w-6 text-[#4a90e2]" />
                            <span className="text-xs">Home</span>
                        </Link>
                        <Link
                            href={getRoute('student.training')}
                            className="flex flex-col items-center rounded-md bg-[#0a1e3c]/70 p-3 text-center text-[#a3c0e6] hover:bg-[#1e3a5f]/50 hover:text-white"
                        >
                            <Activity className="mb-1 h-6 w-6 text-[#4a90e2]" />
                            <span className="text-xs">Your Training</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Layout - Keep the original layout but modify for unranked players
    return (
        <div ref={pageRef} className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            {/* Sidebar (Desktop) */}
            <div ref={sidebarRef} className="fixed z-10 h-full w-64 border-r border-[#1e3a5f] bg-[#0a1e3c]">
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
                <nav ref={navRef} className="space-y-1 p-4">
                    <Link
                        href={getRoute('student.dashboard')}
                        className="flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white transition-colors hover:bg-[#1e3a5f]/80"
                    >
                        <Home className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href={getRoute('student.training')}
                        className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/40 hover:text-white"
                    >
                        <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Training</span>
                    </Link>
                    <Link
                        href={getRoute('student.progress')}
                        className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/40 hover:text-white"
                    >
                        <TrendingUp className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Progress</span>
                    </Link>

                    <div className="pt-4">
                        <h3 className="px-4 py-2 text-xs font-semibold tracking-wider text-[#63b3ed] uppercase">Leaderboards</h3>
                        <Link
                            href={getRoute('leaderboard.strength')}
                            className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/40 hover:text-white"
                        >
                            <Award className="mr-3 h-5 w-5 text-[#4a90e2]" />
                            <span>Strength</span>
                        </Link>
                        <Link
                            href={getRoute('leaderboard.consistency')}
                            className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/40 hover:text-white"
                        >
                            <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2]" />
                            <span>Consistency</span>
                        </Link>
                    </div>
                </nav>
                <div className="absolute bottom-0 w-full border-t border-[#1e3a5f] p-4">
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

            {/* Main Content */}
            <div ref={mainContentRef} className="ml-64 flex-1">
                <header ref={headerRef} className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-8 py-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        {currentBlock && (
                            <div className="flex items-center rounded-lg bg-[#1e3a5f]/50 px-4 py-2">
                                <Calendar className="mr-2 h-5 w-5 text-[#4a90e2]" />
                                <span className="text-sm text-[#a3c0e6]">Current: Block {currentBlock.block_number}</span>
                                {remainingSessions <= 1 && (
                                    <span className="ml-2 rounded-full bg-[#2ecc71]/20 px-2 py-0.5 text-xs text-[#2ecc71]">
                                        {remainingSessions === 0 ? 'Complete' : '1 session left'}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-8 py-6">
                    {/* Stats Grid */}
                    <div ref={statsRef} className="lg:grid-cols- mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Strength Level Card */}
                        <div className="flex flex-col items-center rounded-xl border border-[#1e3a5f] bg-[#0a1e3c] p-6 shadow-lg">
                            <div className="mb-3 flex w-full items-center justify-between">
                                <h3 className="text-sm font-medium tracking-wider text-[#4a90e2] uppercase">Strength Level</h3>
                                <span className="rounded-full bg-[#1e3a5f] px-2.5 py-1 text-xs font-semibold text-[#63b3ed]">XP Based</span>
                            </div>
                            <div className="my-2">
                                <CircularProgress value={strengthLevel} size={160} strokeWidth={12} xpInfo={xpInfo} />
                            </div>
                            {xpInfo && (
                                <div className="mt-4 w-full text-sm text-[#a3c0e6]">
                                    <div className="flex justify-between">
                                        <span>Current XP: {xpInfo.total_xp}</span>
                                        <span>Next Level: {xpInfo.next_level}</span>
                                    </div>
                                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#1e3a5f]">
                                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#1e3a5f]">
                                            <div
                                                className="h-2 rounded-full bg-[#2ecc71]"
                                                style={{ width: hasXp ? `${xpInfo.progress_percentage}%` : '0%' }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="mt-1 flex justify-between text-xs">
                                        <span>{xpInfo.xp_for_current_level} XP</span>
                                        <span>{xpInfo.xp_for_next_level} XP</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Navigation Card */}
                        <div className="rounded-xl border border-[#1e3a5f] bg-[#0a1e3c] p-6 shadow-lg">
                            <h3 className="mb-4 text-sm font-medium tracking-wider text-[#4a90e2] uppercase">Quick Navigation</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Link
                                    href={getRoute('student.training')}
                                    className="flex items-center rounded-lg bg-[#1e3a5f]/80 px-4 py-3 text-white transition-colors hover:bg-[#1e3a5f]"
                                >
                                    <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
                                    <span>Go to Training</span>
                                </Link>
                                <Link
                                    href={getRoute('leaderboard.strength')}
                                    className="flex items-center rounded-lg bg-[#1e3a5f]/30 px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/70 hover:text-white"
                                >
                                    <Award className="mr-3 h-5 w-5 text-[#4a90e2]" />
                                    <span>View Leaderboards</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Block cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {blocks.map((block) => (
                            <button
                                key={block.id}
                                onClick={() => !block.is_locked && handleBlockClick(block)}
                                className={`rounded-lg p-4 text-left transition-colors ${
                                    block.is_current
                                        ? 'bg-[#1e3a5f] shadow-md'
                                        : block.is_locked
                                          ? 'cursor-not-allowed bg-[#1e3a5f]/10'
                                          : 'bg-[#1e3a5f]/30 hover:bg-[#1e3a5f]/50'
                                }`}
                                disabled={block.is_locked}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {block.is_locked ? (
                                            <Lock className="mr-2 h-5 w-5 text-[#a3c0e6]/50" />
                                        ) : (
                                            <Calendar className="mr-2 h-5 w-5 text-[#4a90e2]" />
                                        )}
                                        <span className="text-base font-medium text-white">Block {block.block_number}</span>
                                        {block.is_current && (
                                            <span className="ml-2 rounded-full bg-[#4a90e2]/20 px-2 py-0.5 text-xs text-[#63b3ed]">Current</span>
                                        )}
                                        {block.is_locked && (
                                            <span className="ml-2 rounded-full bg-[#a3c0e6]/20 px-2 py-0.5 text-xs text-[#a3c0e6]">Locked</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-[#a3c0e6]">
                                        {formatDate(block.start_date)} - {formatDate(block.end_date)}
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-[#a3c0e6]">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>14 weeks</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </main>
            </div>

            {/* Block selection prompt */}
            {showPrompt && selectedBlock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 shadow-xl">
                        <h3 className="mb-4 text-xl font-semibold text-white">Block {selectedBlock.block_number}</h3>
                        <p className="mb-4 text-[#a3c0e6]">
                            This block runs from {formatDate(selectedBlock.start_date)} to {formatDate(selectedBlock.end_date)}.
                        </p>
                        <p className="mb-6 text-[#a3c0e6]">Would you like to view the training sessions for this block?</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={closePrompt}
                                className="flex-1 rounded-lg border border-[#1e3a5f] px-4 py-2 text-[#a3c0e6] hover:bg-[#1e3a5f]/30"
                            >
                                Cancel
                            </button>
                            <button onClick={goToTraining} className="flex-1 rounded-lg bg-[#2ecc71] px-4 py-2 text-white hover:bg-[#27ae60]">
                                View Training
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
