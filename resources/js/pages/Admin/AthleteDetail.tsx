import AdminSidebar from '@/components/admin/AdminSidebar';
import Notification from '@/components/admin/dashboard/Notification';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Athlete = {
    id: number;
    username: string;
    email: string;
    created_at: string;
    training_results?: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        single_leg_wall_sit_left: number | null;
        single_leg_wall_sit_right: number | null;
        core_endurance: number | null;
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
};

export default function AthleteDetail({ athlete, activePage, errors = {}, flash }: Props) {
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
            core_endurance: athlete.training_results?.core_endurance || '',
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
                                        <label htmlFor="core_endurance" className="mb-1 block text-sm font-medium text-gray-300">
                                            Core Endurance (sec)
                                        </label>
                                        <input
                                            type="number"
                                            id="core_endurance"
                                            name="training_results.core_endurance"
                                            value={formData.training_results.core_endurance}
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
                </div>
            </main>
        </div>
    );
}
