import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { BarChart2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Student/Layout';

interface LeaderboardUser {
    id: number;
    rank: number;
    username: string;
    consistency_score: number;
    completed_sessions: number;
    available_sessions: number;
    isYou: boolean;
}

interface ConsistencyLeaderboardProps {
    leaderboardData: LeaderboardUser[];
    username?: string;
    routes?: {
        [key: string]: string;
    };
}

const ConsistencyLeaderboard: React.FC<ConsistencyLeaderboardProps> = ({ leaderboardData, username = 'Athlete', routes = {} }) => {
    // State for responsive design
    const [isMobile, setIsMobile] = useState(false);

    // Optional: Add state to track the user's entry for quick jumping in the leaderboard
    const [userEntry, setUserEntry] = useState<LeaderboardUser | null>(null);

    // Refs for GSAP animations
    const pageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const userRowRef = useRef<HTMLTableRowElement | null>(null);

    // Find the current user's entry when data loads
    useEffect(() => {
        const currentUser = leaderboardData.find((user) => user.isYou);
        if (currentUser) {
            setUserEntry(currentUser);
        }
    }, [leaderboardData]);

    // Scroll to user's position when in view
    useEffect(() => {
        if (userRowRef.current) {
            // Scroll with a slight delay to ensure the DOM is ready
            setTimeout(() => {
                userRowRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 500);
        }
    }, [userRowRef.current]);

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

    // Render leaderboard cards for mobile
    const renderMobileLeaderboard = () => {
        if (leaderboardData.length === 0) {
            return <div className="py-4 text-center text-[#a3c0e6]">No data available yet</div>;
        }

        return (
            <div className="space-y-3 px-1 py-2">
                {leaderboardData.map((user) => (
                    <div key={user.id} className={`rounded-lg border border-[#1e3a5f] p-4 ${user.isYou ? 'bg-[#1e3a5f]/30' : 'bg-[#112845]'}`}>
                        <div className="mb-2 flex items-center justify-between">
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
                        </div>
                        <div className="mt-3">
                            <div className="flex items-center">
                                <div className="mr-3 h-2.5 w-full rounded-full bg-[#1e3a5f]">
                                    <div className="h-2.5 rounded-full bg-[#4a90e2]" style={{ width: `${user.consistency_score}%` }}></div>
                                </div>
                                <span className="ml-2 text-sm font-medium whitespace-nowrap text-[#4a90e2]">{user.consistency_score}%</span>
                            </div>
                            <div className="mt-2 text-center text-xs text-[#a3c0e6]">
                                {user.completed_sessions} of {user.available_sessions} available sessions completed
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Render desktop table
    const renderDesktopTable = () => {
        return (
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
                                Available Sessions Completed
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e3a5f] bg-[#112845]">
                        {leaderboardData.length > 0 ? (
                            leaderboardData.map((user) => (
                                <tr key={user.id} ref={user.isYou ? userRowRef : null} className={user.isYou ? 'bg-[#1e3a5f]/30' : undefined}>
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
                                            <div className="mr-2 h-2 w-36 rounded-full bg-[#1e3a5f]">
                                                <div className="h-2 rounded-full bg-[#4a90e2]" style={{ width: `${user.consistency_score}%` }}></div>
                                            </div>
                                            <span className="text-[#4a90e2]">{user.consistency_score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-[#a3c0e6]">
                                        {user.completed_sessions} of {user.available_sessions}
                                    </td>
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
        );
    };

    return (
        <Layout username={username} routes={routes} pageTitle="Consistency Leaderboard">
            <Head title="Consistency Leaderboard" />

            {userEntry && (
                <div ref={headerRef} className="mx-auto mb-6 flex max-w-7xl items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                            <BarChart2 className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                                <span className="mr-2 text-[#a3c0e6]">Your Consistency:</span>
                                <span className="font-bold text-white">{userEntry.consistency_score}%</span>
                                <span className="mx-2 text-[#a3c0e6]">|</span>
                                <span className="mr-2 text-[#a3c0e6]">Rank:</span>
                                <span className="font-bold text-white">{userEntry.rank}</span>
                    </div>
                            </div>
                        )}

            <div ref={mainContentRef} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                        {/* Desktop view - Table */}
                        <div className="hidden sm:block">{renderDesktopTable()}</div>

                        {/* Mobile view - Cards */}
                        <div className="block sm:hidden">{renderMobileLeaderboard()}</div>
                    </div>

                    {/* Explanation */}
                    <div className="mt-4 rounded-lg border border-[#1e3a5f] bg-[#0a1e3c]/80 p-4 text-sm">
                        <h3 className="mb-2 font-medium text-white">How Consistency Works:</h3>
                        <p className="text-[#a3c0e6]">
                            Consistency score is the percentage of available training sessions you've completed. Complete all your available sessions
                            to achieve 100% consistency!
                        </p>
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
                    button,
                    a {
                        min-height: 44px;
                    }
                }
                `,
                }}
            />
        </Layout>
    );
};

export default ConsistencyLeaderboard;
