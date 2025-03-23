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
        <div className="min-h-screen bg-gray-100">
            <Head title="Consistency Leaderboard" />

            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Consistency Leaderboard</h1>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Rank
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Consistency
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Completed Sessions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {leaderboardData.length > 0 ? (
                                    leaderboardData.map((user) => (
                                        <tr key={user.id} className={user.isYou ? 'bg-blue-50' : undefined}>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                {user.rank === 1 && <span className="mr-2">🏆</span>}
                                                {user.rank === 2 && <span className="mr-2">🥈</span>}
                                                {user.rank === 3 && <span className="mr-2">🥉</span>}
                                                {user.rank}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {user.username} {user.isYou && <span className="font-medium text-blue-500">(You)</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mr-2 h-2 w-24 rounded-full bg-gray-200">
                                                        <div
                                                            className="h-2 rounded-full bg-green-500"
                                                            style={{ width: `${user.consistency_score}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-green-600">{user.consistency_score}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{user.completed_sessions}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No data available yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white shadow-lg">
                <div className="flex justify-around">
                    <a href={route('student.training')} className="py-3 text-gray-600 hover:text-gray-900">
                        Training
                    </a>
                    <a href={route('student.dashboard')} className="py-3 text-gray-600 hover:text-gray-900">
                        Home
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

export default ConsistencyLeaderboard;
