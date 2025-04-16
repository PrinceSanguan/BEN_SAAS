import AdminSidebar from '@/components/admin/AdminSidebar';
import Notification from '@/components/admin/dashboard/Notification';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Athlete = {
    id: number;
    username: string;
    email: string;
};

type Props = {
    athlete: Athlete;
    activePage: 'dashboard';
    viewingAsAdmin: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function AthleteDashboardView({ athlete, activePage, viewingAsAdmin, flash }: Props) {
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(
        flash?.success ? { message: flash.success, type: 'success' } : flash?.error ? { message: flash.error, type: 'error' } : null,
    );

    const handleBack = () => {
        router.get('/admin/dashboard');
    };

    const handleEdit = () => {
        router.get(`/admin/athletes/${athlete.id}`);
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

            {/* Admin viewing banner */}
            {viewingAsAdmin && (
                <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 text-center text-white">
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="mr-2 h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                            </svg>
                            <span>You are viewing {athlete.username}'s dashboard as an admin</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleEdit}
                                className="rounded-md bg-white px-2 py-1 text-xs text-amber-800 transition-colors hover:bg-amber-100"
                            >
                                Edit Athlete
                            </button>
                            <button
                                onClick={handleBack}
                                className="rounded-md border border-white bg-transparent px-2 py-1 text-xs text-white transition-colors hover:bg-white/10"
                            >
                                Back to Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            {/* Main Content */}
            <main className={`flex-1 p-4 pt-6 pb-24 md:ml-64 md:p-6 md:pt-6 md:pb-6 ${viewingAsAdmin ? 'mt-10' : ''}`}>
                <Head title={`${athlete.username}'s Dashboard`} />

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-white">{athlete.username}'s Dashboard</h1>
                    </div>

                    {/* Dashboard Content - This would be the actual athlete dashboard content */}
                    <div className="rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 shadow-lg">
                        <div className="p-6 text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-10 w-10"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                </svg>
                            </div>
                            <h2 className="mb-2 text-xl font-bold text-white">Athlete Dashboard Preview</h2>
                            <p className="mb-6 text-gray-400">
                                This is a placeholder for {athlete.username}'s dashboard. In a real implementation, you would see their training data,
                                progress charts, upcoming sessions, and other personalized content here.
                            </p>

                            <div className="mb-6 grid grid-cols-1 gap-4 text-left md:grid-cols-3">
                                <div className="rounded-lg bg-gray-800/50 p-4">
                                    <h3 className="mb-2 font-semibold text-blue-400">Training Progress</h3>
                                    <p className="text-gray-300">View progress metrics and improvements over time.</p>
                                </div>
                                <div className="rounded-lg bg-gray-800/50 p-4">
                                    <h3 className="mb-2 font-semibold text-blue-400">Upcoming Sessions</h3>
                                    <p className="text-gray-300">Schedule and reminders for upcoming training.</p>
                                </div>
                                <div className="rounded-lg bg-gray-800/50 p-4">
                                    <h3 className="mb-2 font-semibold text-blue-400">Personal Records</h3>
                                    <p className="text-gray-300">Track and celebrate personal achievements.</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500">
                                Note: This is just a preview of what the athlete's dashboard would look like. Implement the actual dashboard
                                components here.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
