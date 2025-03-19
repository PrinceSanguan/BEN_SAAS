import { Button } from '@/components/ui/button';
import React from 'react';

// TypeScript interface for component props
interface HomePageProps {
    username: string;
    // In a real app, you might receive the full athlete data from the backend
    // but for now we'll only use the username and keep the mock data for other fields
}

// Use mock data for demonstration, but incorporate the username from props
const HomePage: React.FC<HomePageProps> = ({ username }) => {
    const athleteData = {
        codeName: username, // Now using the username passed from the backend
        strengthLevel: 78,
        consistencyScore: 92,
    };

    // This line is now in the props interface section above
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
                        <p className="mt-1 text-xl font-bold text-gray-800 md:text-2xl">{athleteData.codeName}</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium text-blue-600 uppercase">Strength Level</h2>
                            <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">XP Based</span>
                        </div>
                        <div className="mt-2 h-4 w-full rounded-full bg-gray-200">
                            <div className="h-4 rounded-full bg-green-500" style={{ width: `${athleteData.strengthLevel}%` }}></div>
                        </div>
                        <p className="mt-1 text-right font-bold text-gray-700">{athleteData.strengthLevel}</p>
                    </div>

                    <div className="mb-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium text-blue-600 uppercase">Consistency Score</h2>
                            <span className="text-xs text-gray-500">Based on completed sessions</span>
                        </div>
                        <div className="mt-2 h-4 w-full rounded-full bg-gray-200">
                            <div className="h-4 rounded-full bg-blue-500" style={{ width: `${athleteData.consistencyScore}%` }}></div>
                        </div>
                        <p className="mt-1 text-right font-bold text-gray-700">{athleteData.consistencyScore}%</p>
                    </div>
                </div>

                {/* Leaderboard Links */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Button
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
                        onClick={() => console.log('Navigate to strength leaderboard')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Strength Leaderboard
                    </Button>

                    <Button
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
                        onClick={() => console.log('Navigate to consistency leaderboard')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        Consistency Leaderboard
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
