import { Link, router } from '@inertiajs/react';
import React, { useState } from 'react';

// TypeScript interface for component props
interface StudentDashboardProps {
    username: string;
    strengthLevel: number;
    consistencyScore: number;
    blocks: Array<{
        id: number;
        block_number: number;
        start_date: string;
        end_date: string;
        duration_weeks: number;
        is_current: boolean;
    }>;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ username, strengthLevel, consistencyScore, blocks }) => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<{
        id: number;
        block_number: number;
        start_date: string;
        end_date: string;
        duration_weeks: number;
        is_current: boolean;
    } | null>(null);

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
        // Use the named route from your routes file
        router.visit(route('student.training'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 px-4 py-8 md:py-12">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Athlete Dashboard</h1>
                </div>

                {/* Athlete Stats Card */}
                <div className="mb-8 rounded-xl bg-blue-50 p-6 shadow-md">
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-blue-600 uppercase">Athlete Code Name</h2>
                        <p className="mt-1 text-xl font-bold text-gray-800 md:text-2xl">{username}</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium text-blue-600 uppercase">Strength Level</h2>
                            <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">XP Based</span>
                        </div>
                        <div className="mt-2 h-4 w-full rounded-full bg-gray-200">
                            <div className="h-4 rounded-full bg-green-500" style={{ width: `${(strengthLevel / 5) * 100}%` }}></div>
                        </div>
                        <p className="mt-1 text-right font-bold text-gray-700">{strengthLevel}</p>
                    </div>

                    <div className="mb-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium text-blue-600 uppercase">Consistency Score</h2>
                            <span className="text-xs text-gray-500">Based on completed sessions</span>
                        </div>
                        <div className="mt-2 h-4 w-full rounded-full bg-gray-200">
                            <div className="h-4 rounded-full bg-blue-500" style={{ width: `${consistencyScore}%` }}></div>
                        </div>
                        <p className="mt-1 text-right font-bold text-gray-700">{consistencyScore}%</p>
                    </div>
                </div>

                {/* Leaderboard Links */}
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <Link
                        href="/leaderboard/strength"
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Strength Leaderboard
                    </Link>

                    <Link
                        href="/leaderboard/consistency"
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        Consistency Leaderboard
                    </Link>
                </div>

                {/* Training Button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.visit(route('student.training'))}
                        className="w-full rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            View All Training Sessions
                        </div>
                    </button>
                </div>
            </div>

            {/* Simple Bottom Navigation */}
            <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white shadow-lg">
                <div className="flex justify-around">
                    <a href={route('student.dashboard')} className="border-t-2 border-blue-600 py-3 font-medium text-blue-600">
                        Home
                    </a>
                    <a href={route('student.training')} className="py-3 text-gray-600 hover:text-gray-900">
                        Training
                    </a>
                    <a href="/progress" className="py-3 text-gray-600 hover:text-gray-900">
                        Progress
                    </a>
                    <a href="/settings" className="py-3 text-gray-600 hover:text-gray-900">
                        Settings
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
