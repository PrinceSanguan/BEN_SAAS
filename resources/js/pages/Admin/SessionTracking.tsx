import AdminSidebar from '@/components/admin/AdminSidebar';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Download, Eye, Filter, Search, Target, Trophy, Users } from 'lucide-react';
import { useState } from 'react';

interface Athlete {
    id: number;
    username: string;
    email: string;
    available_sessions: number;
    completed_sessions: number;
    completed_training: number;
    completed_testing: number;
    consistency_percentage: number;
    strength_level: number;
    total_xp: number;
}

interface Props {
    athletes: Athlete[];
    activePage: 'dashboard' | 'email-templates' | 'summaries' | 'page-content' | 'submission-logs' | 'session-tracking';
}

export default function SessionTracking({ athletes, activePage }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('username');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filterBy, setFilterBy] = useState('all');

    // Filter and search athletes
    const filteredAthletes = athletes
        .filter((athlete) => {
            const matchesSearch =
                athlete.username.toLowerCase().includes(searchTerm.toLowerCase()) || athlete.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterBy === 'all' ||
                (filterBy === 'high-consistency' && athlete.consistency_percentage >= 80) ||
                (filterBy === 'medium-consistency' && athlete.consistency_percentage >= 50 && athlete.consistency_percentage < 80) ||
                (filterBy === 'low-consistency' && athlete.consistency_percentage < 50) ||
                (filterBy === 'level-2+' && athlete.strength_level >= 2);

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            let aValue = a[sortBy as keyof Athlete];
            let bValue = b[sortBy as keyof Athlete];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = (bValue as string).toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const viewAthleteDetails = (athleteId: number) => {
        router.get(`/admin/session-tracking/${athleteId}`);
    };

    const getConsistencyColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-400 bg-green-400/10';
        if (percentage >= 50) return 'text-yellow-400 bg-yellow-400/10';
        return 'text-red-400 bg-red-400/10';
    };

    const getStrengthLevelColor = (level: number) => {
        const colors = [
            'bg-gray-600', // Level 1
            'bg-green-600', // Level 2
            'bg-blue-600', // Level 3
            'bg-purple-600', // Level 4
            'bg-orange-600', // Level 5
        ];
        return colors[level - 1] || 'bg-gray-600';
    };

    // Calculate summary stats
    const totalAthletes = athletes.length;
    const avgConsistency = Math.round(athletes.reduce((sum, a) => sum + a.consistency_percentage, 0) / totalAthletes);
    const highPerformers = athletes.filter((a) => a.consistency_percentage >= 80).length;
    const totalSessionsCompleted = athletes.reduce((sum, a) => sum + a.completed_sessions, 0);

    return (
        <>
            <Head title="Session Tracking - Admin Dashboard" />
            <div className="flex h-screen bg-gray-950">
                <AdminSidebar activePage={activePage} />

                <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
                    {/* Header */}
                    <div className="border-b border-gray-800 bg-gray-900/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Session Tracking</h1>
                                <p className="mt-1 text-gray-400">Monitor athlete session completion and progress</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                                    <Download className="h-4 w-4" />
                                    <span>Export Report</span>
                                </button>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="rounded-lg bg-gray-800/50 p-4">
                                <div className="flex items-center">
                                    <Users className="h-8 w-8 text-blue-400" />
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-400">Total Athletes</p>
                                        <p className="text-2xl font-bold text-white">{totalAthletes}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-800/50 p-4">
                                <div className="flex items-center">
                                    <Target className="h-8 w-8 text-green-400" />
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-400">Avg Consistency</p>
                                        <p className="text-2xl font-bold text-white">{avgConsistency}%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-800/50 p-4">
                                <div className="flex items-center">
                                    <Trophy className="h-8 w-8 text-yellow-400" />
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-400">High Performers</p>
                                        <p className="text-2xl font-bold text-white">{highPerformers}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-800/50 p-4">
                                <div className="flex items-center">
                                    <CheckCircle className="h-8 w-8 text-purple-400" />
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-400">Total Sessions</p>
                                        <p className="text-2xl font-bold text-white">{totalSessionsCompleted}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="border-b border-gray-800 bg-gray-900/30 p-4">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center space-x-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search athletes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="rounded-lg border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Filter */}
                                <div className="relative">
                                    <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <select
                                        value={filterBy}
                                        onChange={(e) => setFilterBy(e.target.value)}
                                        className="appearance-none rounded-lg border border-gray-700 bg-gray-800 py-2 pr-8 pl-10 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Athletes</option>
                                        <option value="high-consistency">High Consistency (80%+)</option>
                                        <option value="medium-consistency">Medium Consistency (50-80%)</option>
                                        <option value="low-consistency">Low Consistency (&lt;50%)</option>
                                        <option value="level-2+">Level 2+ Athletes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="text-sm text-gray-400">
                                Showing {filteredAthletes.length} of {totalAthletes} athletes
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-gray-800/50">
                                    <tr>
                                        <th
                                            className="cursor-pointer px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase hover:text-white"
                                            onClick={() => handleSort('username')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Athlete</span>
                                                {sortBy === 'username' && <span className="text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                            </div>
                                        </th>
                                        <th
                                            className="cursor-pointer px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase hover:text-white"
                                            onClick={() => handleSort('strength_level')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Level</span>
                                                {sortBy === 'strength_level' && (
                                                    <span className="text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            className="cursor-pointer px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase hover:text-white"
                                            onClick={() => handleSort('total_xp')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Total XP</span>
                                                {sortBy === 'total_xp' && <span className="text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                            </div>
                                        </th>
                                        <th
                                            className="cursor-pointer px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase hover:text-white"
                                            onClick={() => handleSort('consistency_percentage')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Consistency</span>
                                                {sortBy === 'consistency_percentage' && (
                                                    <span className="text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                            Sessions Completed
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                            Training / Testing
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-medium tracking-wider text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900">
                                    {filteredAthletes.map((athlete) => (
                                        <tr key={athlete.id} className="transition-colors hover:bg-gray-800/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-white">{athlete.username}</div>
                                                    <div className="text-sm text-gray-400">{athlete.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className={`flex h-8 w-8 items-center justify-center rounded-md ${getStrengthLevelColor(athlete.strength_level)}`}
                                                    >
                                                        <span className="text-xs font-bold text-white">{athlete.strength_level}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-white">{athlete.total_xp} XP</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getConsistencyColor(athlete.consistency_percentage)}`}
                                                    >
                                                        {athlete.consistency_percentage}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white">
                                                    <span className="font-medium">{athlete.completed_sessions}</span>
                                                    <span className="text-gray-400"> / {athlete.available_sessions}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white">
                                                    <span className="text-blue-400">{athlete.completed_training}</span>
                                                    <span className="text-gray-400"> / </span>
                                                    <span className="text-green-400">{athlete.completed_testing}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <button
                                                    onClick={() => viewAthleteDetails(athlete.id)}
                                                    className="inline-flex items-center rounded-md border border-transparent px-3 py-1 text-sm leading-4 font-medium text-blue-400 transition-colors hover:bg-blue-400/10 hover:text-blue-300"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredAthletes.length === 0 && (
                            <div className="py-12 text-center">
                                <Users className="mx-auto h-12 w-12 text-gray-500" />
                                <h3 className="mt-2 text-sm font-medium text-gray-300">No athletes found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
