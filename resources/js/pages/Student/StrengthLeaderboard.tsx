import { Head } from '@inertiajs/react';
import React from 'react';

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
}

const ConsistencyLeaderboard: React.FC<ConsistencyLeaderboardProps> = ({ leaderboardData }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a] pb-24">
            <Head title="Consistency Leaderboard" />

            <header className="sticky top-0 z-10 bg-[#0a1e3c]/80 backdrop-blur-md border-b border-[#1e3a5f] px-4 py-4">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#9f6aff] mr-3">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 20h20M5 20V13M10 20V10M15 20v-8M20 20V4"></path>
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white">Consistency Leaderboard</h1>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="overflow-hidden rounded-xl bg-[#112845] shadow-lg border border-[#1e3a5f]">
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
            </div>

            {/* Bottom Navigation - Styled for Blue Theme */}
            <div className="fixed right-0 bottom-0 left-0 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 backdrop-blur-md shadow-lg z-20">
                <div className="max-w-7xl mx-auto flex justify-around">
                    <a
                        href="/training"
                        className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
                    >
                        <svg className="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                        <span className="text-xs">Training</span>
                    </a>
                    <a
                        href="/dashboard"
                        className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
                    >
                        <svg className="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs">Home</span>
                    </a>
                    <a
                        href="/progress"
                        className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
                    >
                        <svg className="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                        <span className="text-xs">Progress</span>
                    </a>
                    <a
                        href="/consistency-leaderboard"
                        className="flex flex-col items-center py-3 px-4 text-[#7c3aed] border-t-2 border-[#7c3aed]"
                    >
                        <svg className="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 20h20M5 20V13M10 20V10M15 20v-8M20 20V4"></path>
                        </svg>
                        <span className="text-xs">Consistency</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ConsistencyLeaderboard;
