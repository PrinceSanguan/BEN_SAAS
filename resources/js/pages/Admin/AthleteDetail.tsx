import AdminSidebar from '@/components/admin/AdminSidebar';
import Notification from '@/components/admin/dashboard/Notification';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Athlete = {
    id: number;
    username: string;
    email: string;
    created_at: string;
    strength_level?: number;
    consistency_score?: number;
    training_results?: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        single_leg_wall_sit_left: number | null;
        single_leg_wall_sit_right: number | null;
        core_endurance_left: number | null;
        core_endurance_right: number | null;
        bent_arm_hang: number | null;
    };
};

type Props = {
    athlete: Athlete;
    activePage: 'dashboard';
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
    progressData?: { [key: string]: any };
    xpInfo?: {
        total_xp: number;
        current_level: number;
        next_level: number;
    };
};

export default function AthleteDetail({ athlete, activePage, errors = {}, flash, progressData, xpInfo }: Props) {
    const [formData, setFormData] = useState({
        username: athlete.username,
        parent_email: athlete.email,
        password: '',
        training_results: {
            standing_long_jump: athlete.training_results?.standing_long_jump || '',
            single_leg_jump_left: athlete.training_results?.single_leg_jump_left || '',
            single_leg_jump_right: athlete.training_results?.single_leg_jump_right || '',
            single_leg_wall_sit_left: athlete.training_results?.single_leg_wall_sit_left || '',
            single_leg_wall_sit_right: athlete.training_results?.single_leg_wall_sit_right || '',
            core_endurance_left: athlete.training_results?.core_endurance_left || '',
            core_endurance_right: athlete.training_results?.core_endurance_right || '',
            bent_arm_hang: athlete.training_results?.bent_arm_hang || '',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(
        flash?.success ? { message: flash.success, type: 'success' } : flash?.error ? { message: flash.error, type: 'error' } : null,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.includes('training_results.')) {
            const trainingField = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                training_results: {
                    ...prev.training_results,
                    [trainingField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(`/admin/athletes/${athlete.id}`, formData, {
            onSuccess: () => {
                setIsSubmitting(false);
                setNotification({ message: 'Athlete updated successfully', type: 'success' });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                const firstError = Object.values(errors)[0] as string;
                setNotification({ message: firstError, type: 'error' });
            },
        });
    };

    // Function to view athlete dashboard
    const handleViewDashboard = () => {
        // Use the updated route that will log in as student
        router.get(`/admin/athletes/${athlete.id}/dashboard`);
    };

    const handleBack = () => {
        router.get('/admin/dashboard');
    };

    const [isSendingReset, setIsSendingReset] = useState(false);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <AdminSidebar activePage={activePage} />
            </div>

            {/* Mobile Bottom Tab Navigation */}
            <div className="block md:hidden">
                <AdminSidebar activePage={activePage} isMobile={true} />
            </div>

            {/* Notification */}
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            {/* Main Content */}
            <main className="flex-1 p-4 pt-6 pb-24 md:ml-64 md:p-6 md:pt-6 md:pb-6">
                <Head title={`Edit Athlete: ${athlete.username}`} />

                <div className="space-y-6">
                    {/* Header with back button */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <button onClick={handleBack} className="flex items-center text-blue-400 transition-colors hover:text-blue-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="mr-1 h-5 w-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <div className="flex w-full justify-between sm:w-auto sm:gap-3">
                            <button
                                onClick={handleViewDashboard}
                                className="rounded-lg border border-blue-600 bg-transparent px-4 py-2 font-medium text-blue-500 transition-all hover:bg-blue-600 hover:text-white"
                            >
                                View Dashboard
                            </button>

                            <button
                                onClick={() => {
                                    setIsSendingReset(true);
                                    router.post(
                                        `/admin/athletes/${athlete.id}/send-reset`,
                                        {},
                                        {
                                            onSuccess: () => {
                                                setIsSendingReset(false);
                                                setNotification({ message: 'Password reset link sent successfully!', type: 'success' });
                                            },
                                            onError: () => {
                                                setIsSendingReset(false);
                                                setNotification({ message: 'Failed to send password reset link.', type: 'error' });
                                            },
                                        },
                                    );
                                }}
                                disabled={isSendingReset}
                                className="rounded-lg border border-orange-600 bg-orange-600 px-4 py-2 font-medium text-white transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSendingReset ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Athlete: {athlete.username}</h1>
                        <p className="mt-1 text-gray-400">Joined on {new Date(athlete.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Edit Form */}
                    <div className="rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="border-b border-gray-700 pb-6">
                                <h2 className="mb-4 text-xl font-semibold text-white">Basic Information</h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-300">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                            required
                                        />
                                        {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="parent_email" className="mb-1 block text-sm font-medium text-gray-300">
                                            Parent Email
                                        </label>
                                        <input
                                            type="email"
                                            id="parent_email"
                                            name="parent_email"
                                            value={formData.parent_email}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                            required
                                        />
                                        {errors.parent_email && <p className="mt-1 text-sm text-red-400">{errors.parent_email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-300">
                                            New Password (leave empty to keep unchanged)
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Training Results */}
                            <div>
                                <h2 className="mb-4 text-xl font-semibold text-white">Training Results</h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label htmlFor="standing_long_jump" className="mb-1 block text-sm font-medium text-gray-300">
                                            Standing Long Jump (cm)
                                        </label>
                                        <input
                                            type="number"
                                            id="standing_long_jump"
                                            name="training_results.standing_long_jump"
                                            value={formData.training_results.standing_long_jump}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="single_leg_jump_left" className="mb-1 block text-sm font-medium text-gray-300">
                                            Single Leg Jump - Left (cm)
                                        </label>
                                        <input
                                            type="number"
                                            id="single_leg_jump_left"
                                            name="training_results.single_leg_jump_left"
                                            value={formData.training_results.single_leg_jump_left}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="single_leg_jump_right" className="mb-1 block text-sm font-medium text-gray-300">
                                            Single Leg Jump - Right (cm)
                                        </label>
                                        <input
                                            type="number"
                                            id="single_leg_jump_right"
                                            name="training_results.single_leg_jump_right"
                                            value={formData.training_results.single_leg_jump_right}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="single_leg_wall_sit_left" className="mb-1 block text-sm font-medium text-gray-300">
                                            Single Leg Wall Sit - Left (sec)
                                        </label>
                                        <input
                                            type="number"
                                            id="single_leg_wall_sit_left"
                                            name="training_results.single_leg_wall_sit_left"
                                            value={formData.training_results.single_leg_wall_sit_left}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="single_leg_wall_sit_right" className="mb-1 block text-sm font-medium text-gray-300">
                                            Single Leg Wall Sit - Right (sec)
                                        </label>
                                        <input
                                            type="number"
                                            id="single_leg_wall_sit_right"
                                            name="training_results.single_leg_wall_sit_right"
                                            value={formData.training_results.single_leg_wall_sit_right}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="core_endurance_left" className="mb-1 block text-sm font-medium text-gray-300">
                                            Core Endurance - Left (sec)
                                        </label>
                                        <input
                                            type="number"
                                            id="core_endurance_left"
                                            name="training_results.core_endurance_left"
                                            value={formData.training_results.core_endurance_left}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="core_endurance_right" className="mb-1 block text-sm font-medium text-gray-300">
                                            Core Endurance - Right (sec)
                                        </label>
                                        <input
                                            type="number"
                                            id="core_endurance_right"
                                            name="training_results.core_endurance_right"
                                            value={formData.training_results.core_endurance_right}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bent_arm_hang" className="mb-1 block text-sm font-medium text-gray-300">
                                            Bent Arm Hang (sec)
                                        </label>
                                        <input
                                            type="number"
                                            id="bent_arm_hang"
                                            name="training_results.bent_arm_hang"
                                            value={formData.training_results.bent_arm_hang}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-6">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="rounded-lg border border-gray-600 bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-600 focus:outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Progress Stats */}
                    <div className="border-b border-gray-700 pb-6">
                        <h2 className="mb-4 text-xl font-semibold text-white">Athlete Stats</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                                <h3 className="mb-2 text-sm font-medium text-gray-300">Strength Level</h3>
                                <div className="flex items-end">
                                    <p className="text-2xl font-bold text-white">{athlete.strength_level || 1}</p>
                                    {xpInfo?.next_level && <p className="ml-2 text-xs text-gray-400">Next: {xpInfo.next_level}</p>}
                                </div>
                                {xpInfo && (
                                    <div className="mt-2">
                                        <div className="h-1.5 w-full rounded-full bg-gray-600">
                                            <div
                                                className="h-1.5 rounded-full bg-blue-500"
                                                style={{ width: `${(xpInfo.total_xp / (xpInfo.next_level * 5)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-400">{xpInfo.total_xp} XP Total</p>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                                <h3 className="mb-2 text-sm font-medium text-gray-300">Consistency Score</h3>
                                <p className="text-2xl font-bold text-white">{athlete.consistency_score || 0}%</p>
                                <div className="mt-2">
                                    <div className="h-1.5 w-full rounded-full bg-gray-600">
                                        <div
                                            className="h-1.5 rounded-full bg-green-500"
                                            style={{ width: `${athlete.consistency_score || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                                <h3 className="mb-2 text-sm font-medium text-gray-300">Total Tests Completed</h3>
                                <p className="text-2xl font-bold text-white">{progressData ? Object.keys(progressData).length : 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Charts */}
                    {progressData && Object.keys(progressData).length > 0 && (
                        <div className="border-b border-gray-700 pb-6">
                            <h2 className="mb-4 text-xl font-semibold text-white">Progress Charts</h2>
                            <div className="space-y-8">
                                {Object.entries(progressData).map(([testKey, data]) => (
                                    <div key={testKey} className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="text-md font-semibold text-white">{data.name}</h3>
                                            {data.percentageIncrease !== null && (
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        data.percentageIncrease > 0 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                                                    }`}
                                                >
                                                    {data.percentageIncrease > 0 ? '+' : ''}
                                                    {data.percentageIncrease}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={data.sessions}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis
                                                        dataKey="date"
                                                        tick={{ fill: '#9CA3AF' }}
                                                        tickFormatter={(date: string) =>
                                                            new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                        }
                                                    />
                                                    <YAxis tick={{ fill: '#9CA3AF' }} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                                                        labelStyle={{ color: '#9CA3AF' }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="value"
                                                        name={data.name}
                                                        stroke="#3B82F6"
                                                        strokeWidth={2}
                                                        dot={{ r: 5, fill: '#3B82F6' }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
