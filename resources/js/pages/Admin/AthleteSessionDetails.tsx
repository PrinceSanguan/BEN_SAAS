import AdminSidebar from '@/components/admin/AdminSidebar';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, Eye, Filter, Target, Trophy, XCircle } from 'lucide-react';
import { useState } from 'react';

interface SessionDetails {
    warmup_completed?: string;
    plyometrics_score?: string;
    power_score?: string;
    lower_body_strength_score?: string;
    upper_body_core_strength_score?: string;
    standing_long_jump?: number;
    single_leg_jump_left?: number;
    single_leg_jump_right?: number;
    single_leg_wall_sit_left?: number;
    single_leg_wall_sit_right?: number;
    core_endurance_left?: number;
    core_endurance_right?: number;
    bent_arm_hang_assessment?: number;
}

interface Session {
    id: number;
    session_type: string;
    week_number: number;
    session_number: number;
    block_number: number | null;
    release_date: string;
    is_released: boolean;
    is_completed: boolean;
    completed_at: string | null;
    xp_earned: number;
    session_details: SessionDetails | null;
}

interface Athlete {
    id: number;
    username: string;
    email: string;
    strength_level: number;
    total_xp: number;
    consistency_score: number;
}

interface Summary {
    total_sessions: number;
    completed_sessions: number;
    released_sessions: number;
    total_xp_earned: number;
    training_completed: number;
    testing_completed: number;
}

interface Props {
    athlete: Athlete;
    sessions: Session[];
    summary: Summary;
    activePage: 'dashboard' | 'email-templates' | 'summaries' | 'page-content' | 'submission-logs' | 'session-tracking';
}

export default function AthleteSessionDetails({ athlete, sessions, summary, activePage }: Props) {
    const [filterType, setFilterType] = useState<'all' | 'training' | 'testing' | 'completed' | 'pending'>('all');
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    const filteredSessions = sessions.filter((session) => {
        switch (filterType) {
            case 'training':
                return session.session_type === 'training';
            case 'testing':
                return session.session_type === 'testing';
            case 'completed':
                return session.is_completed;
            case 'pending':
                return session.is_released && !session.is_completed;
            default:
                return true;
        }
    });

    const getSessionStatusIcon = (session: Session) => {
        if (!session.is_released) {
            return <Clock className="h-5 w-5 text-gray-400" />;
        }
        if (session.is_completed) {
            return <CheckCircle className="h-5 w-5 text-green-400" />;
        }
        return <XCircle className="h-5 w-5 text-red-400" />;
    };

    const getSessionStatusText = (session: Session) => {
        if (!session.is_released) return 'Not Released';
        if (session.is_completed) return 'Completed';
        return 'Pending';
    };

    const getSessionStatusColor = (session: Session) => {
        if (!session.is_released) return 'bg-gray-600/20 text-gray-400';
        if (session.is_completed) return 'bg-green-600/20 text-green-400';
        return 'bg-red-600/20 text-red-400';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const goBack = () => {
        router.get('/admin/session-tracking');
    };

    const SessionDetailsModal = ({ session, onClose }: { session: Session; onClose: () => void }) => (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-gray-900">
                <div className="border-b border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                            {session.session_type === 'training' ? 'Training' : 'Testing'} Session Details
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ×
                        </button>
                    </div>
                    <p className="mt-1 text-gray-400">
                        Block {session.block_number} - Week {session.week_number} - Session {session.session_number}
                    </p>
                </div>

                <div className="p-6">
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-400">Release Date</p>
                            <p className="text-white">{formatDate(session.release_date)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getSessionStatusColor(session)}`}>
                                {getSessionStatusText(session)}
                            </span>
                        </div>
                        {session.completed_at && (
                            <>
                                <div>
                                    <p className="text-sm text-gray-400">Completed Date</p>
                                    <p className="text-white">{formatDate(session.completed_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">XP Earned</p>
                                    <p className="font-semibold text-green-400">{session.xp_earned} XP</p>
                                </div>
                            </>
                        )}
                    </div>

                    {session.session_details && (
                        <div>
                            <h4 className="text-md mb-4 font-semibold text-white">Session Data</h4>
                            <div className="rounded-lg bg-gray-800/50 p-4">
                                {session.session_type === 'training' ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Warmup Completed:</span>
                                            <span className={session.session_details.warmup_completed === 'YES' ? 'text-green-400' : 'text-red-400'}>
                                                {session.session_details.warmup_completed || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Plyometrics Score:</span>
                                            <span className="text-white">{session.session_details.plyometrics_score || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Power Score:</span>
                                            <span className="text-white">{session.session_details.power_score || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Lower Body Strength:</span>
                                            <span className="text-white">{session.session_details.lower_body_strength_score || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Upper Body/Core Strength:</span>
                                            <span className="text-white">{session.session_details.upper_body_core_strength_score || 'N/A'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Standing Long Jump:</span>
                                            <span className="text-white">
                                                {session.session_details.standing_long_jump
                                                    ? `${session.session_details.standing_long_jump} cm`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Single Leg Jump (Left):</span>
                                            <span className="text-white">
                                                {session.session_details.single_leg_jump_left
                                                    ? `${session.session_details.single_leg_jump_left} cm`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Single Leg Jump (Right):</span>
                                            <span className="text-white">
                                                {session.session_details.single_leg_jump_right
                                                    ? `${session.session_details.single_leg_jump_right} cm`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Single Leg Wall Sit (Left):</span>
                                            <span className="text-white">
                                                {session.session_details.single_leg_wall_sit_left
                                                    ? `${session.session_details.single_leg_wall_sit_left} sec`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Single Leg Wall Sit (Right):</span>
                                            <span className="text-white">
                                                {session.session_details.single_leg_wall_sit_right
                                                    ? `${session.session_details.single_leg_wall_sit_right} sec`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Core Endurance (Left):</span>
                                            <span className="text-white">
                                                {session.session_details.core_endurance_left
                                                    ? `${session.session_details.core_endurance_left} sec`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Core Endurance (Right):</span>
                                            <span className="text-white">
                                                {session.session_details.core_endurance_right
                                                    ? `${session.session_details.core_endurance_right} sec`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        {session.session_details.bent_arm_hang_assessment && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Bent Arm Hang (Bonus):</span>
                                                <span className="text-yellow-400">{session.session_details.bent_arm_hang_assessment} sec</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`${athlete.username} - Session Details`} />
            <div className="flex h-screen bg-gray-950">
                <AdminSidebar activePage={activePage} />

                <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
                    {/* Header */}
                    <div className="border-b border-gray-800 bg-gray-900/50 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button onClick={goBack} className="flex items-center space-x-2 text-gray-400 transition-colors hover:text-white">
                                    <ArrowLeft className="h-5 w-5" />
                                    <span>Back to Session Tracking</span>
                                </button>
                            </div>
                        </div>

                        {/* Athlete Info */}
                        <div className="mt-6">
                            <h1 className="text-2xl font-bold text-white">{athlete.username}</h1>
                            <p className="text-gray-400">{athlete.email}</p>

                            <div className="mt-4 flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Trophy className="h-5 w-5 text-yellow-400" />
                                    <span className="text-gray-300">Level {athlete.strength_level}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Target className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-300">{athlete.total_xp} XP</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <span className="text-gray-300">{athlete.consistency_score}% Consistency</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-6">
                            <div className="rounded-lg bg-gray-800/50 p-3 text-center">
                                <p className="text-xs text-gray-400">Total Sessions</p>
                                <p className="text-lg font-bold text-white">{summary.total_sessions}</p>
                            </div>
                            <div className="rounded-lg bg-gray-800/50 p-3 text-center">
                                <p className="text-xs text-gray-400">Completed</p>
                                <p className="text-lg font-bold text-green-400">{summary.completed_sessions}</p>
                            </div>
                            <div className="rounded-lg bg-gray-800/50 p-3 text-center">
                                <p className="text-xs text-gray-400">Training</p>
                                <p className="text-lg font-bold text-blue-400">{summary.training_completed}</p>
                            </div>
                            <div className="rounded-lg bg-gray-800/50 p-3 text-center">
                                <p className="text-xs text-gray-400">Testing</p>
                                <p className="text-lg font-bold text-purple-400">{summary.testing_completed}</p>
                            </div>
                            <div className="rounded-lg bg-gray-800/50 p-3 text-center">
                                <p className="text-xs text-gray-400">Released</p>
                                <p className="text-lg font-bold text-yellow-400">{summary.released_sessions}</p>
                            </div>
                            <div className="rounded-lg bg-gray-800/50 p-3 text-center">
                                <p className="text-xs text-gray-400">Total XP</p>
                                <p className="text-lg font-bold text-green-400">{summary.total_xp_earned}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="border-b border-gray-800 bg-gray-900/30 p-4">
                        <div className="flex items-center space-x-4">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <div className="flex space-x-2">
                                {[
                                    { key: 'all', label: 'All Sessions', count: sessions.length },
                                    { key: 'training', label: 'Training', count: sessions.filter((s) => s.session_type === 'training').length },
                                    { key: 'testing', label: 'Testing', count: sessions.filter((s) => s.session_type === 'testing').length },
                                    { key: 'completed', label: 'Completed', count: sessions.filter((s) => s.is_completed).length },
                                    { key: 'pending', label: 'Pending', count: sessions.filter((s) => s.is_released && !s.is_completed).length },
                                ].map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setFilterType(filter.key as any)}
                                        className={`rounded-full px-3 py-1 text-sm transition-colors ${
                                            filterType === filter.key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        {filter.label} ({filter.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sessions Table */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Session</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Release Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Completed Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">XP Earned</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium tracking-wider text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 bg-gray-900">
                                {filteredSessions.map((session) => (
                                    <tr key={session.id} className="transition-colors hover:bg-gray-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">
                                                Block {session.block_number} - Week {session.week_number}
                                            </div>
                                            <div className="text-sm text-gray-400">Session {session.session_number}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    session.session_type === 'training'
                                                        ? 'bg-blue-600/20 text-blue-400'
                                                        : 'bg-purple-600/20 text-purple-400'
                                                }`}
                                            >
                                                {session.session_type === 'training' ? 'Training' : 'Testing'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-white">{formatDate(session.release_date)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getSessionStatusIcon(session)}
                                                <span
                                                    className={`text-sm ${
                                                        session.is_completed
                                                            ? 'text-green-400'
                                                            : session.is_released
                                                              ? 'text-red-400'
                                                              : 'text-gray-400'
                                                    }`}
                                                >
                                                    {getSessionStatusText(session)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-white">
                                                {session.completed_at ? formatDate(session.completed_at) : '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${session.xp_earned > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                                {session.xp_earned > 0 ? `+${session.xp_earned} XP` : '0 XP'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {session.session_details && (
                                                <button
                                                    onClick={() => setSelectedSession(session)}
                                                    className="inline-flex items-center rounded-md border border-transparent px-2 py-1 text-sm leading-4 font-medium text-blue-400 transition-colors hover:bg-blue-400/10 hover:text-blue-300"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    View
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredSessions.length === 0 && (
                            <div className="py-12 text-center">
                                <Calendar className="mx-auto h-12 w-12 text-gray-500" />
                                <h3 className="mt-2 text-sm font-medium text-gray-300">No sessions found</h3>
                                <p className="mt-1 text-sm text-gray-500">No sessions match the current filter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedSession && <SessionDetailsModal session={selectedSession} onClose={() => setSelectedSession(null)} />}
        </>
    );
}
