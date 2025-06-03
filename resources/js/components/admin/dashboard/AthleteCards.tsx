import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Athlete = {
    id: number;
    username: string;
    email: string;
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

interface AthleteCardsProps {
    athletes: Athlete[];
    onAddClick: () => void;
}

export default function AthleteCards({ athletes, onAddClick }: AthleteCardsProps) {
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [sendingResetFor, setSendingResetFor] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Auto-hide success/error messages after 3 seconds
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    // Function to handle the deletion
    const handleDelete = (id: number) => {
        router.delete(`/admin/athletes/${id}`, {
            onSuccess: () => {
                setDeleteConfirmation(null);
                window.location.reload();
            },
        });
    };

    // Function to navigate to edit page
    const handleEdit = (id: number) => {
        router.get(`/admin/athletes/${id}`);
    };

    // Function to view athlete dashboard
    const handleViewDashboard = (id: number) => {
        router.get(`/admin/athletes/${id}/dashboard`);
    };

    // Function to send password reset
    const handleSendReset = (athlete: Athlete) => {
        setSendingResetFor(athlete.id);
        setMenuOpen(null);

        router.post(
            `/admin/athletes/${athlete.id}/send-reset`,
            {},
            {
                onSuccess: () => {
                    setSendingResetFor(null);
                    setSuccessMessage(`Password reset link sent successfully to ${athlete.email}!`);
                },
                onError: () => {
                    setSendingResetFor(null);
                    setErrorMessage('Failed to send password reset link. Please try again.');
                },
            },
        );
    };

    if (athletes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-16 text-center shadow-2xl backdrop-blur-sm">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="h-10 w-10">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <h2 className="mb-3 text-2xl font-bold text-white">No Athletes Found</h2>
                <p className="mb-8 max-w-md text-slate-400">Start building your training program by adding your first athlete to the platform.</p>
                <button
                    onClick={onAddClick}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="mr-2 h-5 w-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Your First Athlete
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Loading Screen Overlay */}
            {sendingResetFor !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-sm rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                <svg
                                    className="h-8 w-8 animate-spin text-blue-500"
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
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">Sending Reset Link</h3>
                            <p className="text-slate-400">Please wait while we send the password reset email...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div className="animate-slide-in-right fixed top-4 right-4 z-40 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white shadow-2xl backdrop-blur-sm">
                    <div className="flex items-center">
                        <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">{successMessage}</span>
                        <button onClick={() => setSuccessMessage(null)} className="ml-4 text-green-200 transition-colors hover:text-white">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="animate-slide-in-right fixed top-4 right-4 z-40 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white shadow-2xl backdrop-blur-sm">
                    <div className="flex items-center">
                        <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="font-medium">{errorMessage}</span>
                        <button onClick={() => setErrorMessage(null)} className="ml-4 text-red-200 transition-colors hover:text-white">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Add Athlete Card */}
                <div
                    onClick={onAddClick}
                    className="group flex h-72 cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:from-slate-800/70 hover:to-slate-700/70 hover:shadow-2xl"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 transition-all duration-300 group-hover:from-blue-500/30 group-hover:to-purple-500/30">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-8 w-8"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white transition-colors group-hover:text-blue-400">Add Athlete</h3>
                    <p className="mt-2 text-sm text-slate-400">Create a new athlete profile</p>
                </div>

                {/* Athlete Cards */}
                {athletes.map((athlete) => (
                    <Card
                        key={athlete.id}
                        className="group cursor-pointer overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-800/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-2xl"
                        onClick={() => handleEdit(athlete.id)}
                    >
                        <CardHeader className="relative border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50 pt-4 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                                        {athlete.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-white">{athlete.username}</CardTitle>
                                        <p className="text-sm text-slate-400">{athlete.email}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpen(menuOpen === athlete.id ? null : athlete.id);
                                        }}
                                        className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-700 hover:text-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                            />
                                        </svg>
                                    </button>

                                    {menuOpen === athlete.id && (
                                        <div
                                            ref={menuRef}
                                            className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-600 bg-slate-800 shadow-2xl ring-1 ring-slate-700 backdrop-blur-sm"
                                        >
                                            <div className="py-2" role="menu" aria-orientation="vertical">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(athlete.id);
                                                    }}
                                                    className="group flex w-full items-center px-4 py-3 text-sm text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white"
                                                    role="menuitem"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="mr-3 h-5 w-5 text-blue-400"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                        />
                                                    </svg>
                                                    Edit Athlete
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDashboard(athlete.id);
                                                    }}
                                                    className="group flex w-full items-center px-4 py-3 text-sm text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white"
                                                    role="menuitem"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="mr-3 h-5 w-5 text-green-400"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                                                        />
                                                    </svg>
                                                    View Dashboard
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSendReset(athlete);
                                                    }}
                                                    className="group flex w-full items-center px-4 py-3 text-sm text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white"
                                                    role="menuitem"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="mr-3 h-5 w-5 text-orange-400"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                                        />
                                                    </svg>
                                                    Send Reset Link
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteConfirmation(athlete.id);
                                                        setMenuOpen(null);
                                                    }}
                                                    className="group flex w-full items-center px-4 py-3 text-sm text-red-400 transition-all duration-200 hover:bg-red-900/50 hover:text-red-300"
                                                    role="menuitem"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="mr-3 h-5 w-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                        />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <h3 className="mb-4 flex items-center font-semibold text-blue-400">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                                Pre-Training Results
                            </h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Standing Long Jump</p>
                                    <p className="font-semibold text-white">{athlete.training_results?.standing_long_jump || '-'} cm</p>
                                </div>
                                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Single Leg Jump (L)</p>
                                    <p className="font-semibold text-white">{athlete.training_results?.single_leg_jump_left || '-'} cm</p>
                                </div>
                                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Single Leg Jump (R)</p>
                                    <p className="font-semibold text-white">{athlete.training_results?.single_leg_jump_right || '-'} cm</p>
                                </div>
                                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Wall Sit (L)</p>
                                    <p className="font-semibold text-white">{athlete.training_results?.single_leg_wall_sit_left || '-'} sec</p>
                                </div>
                                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Wall Sit (R)</p>
                                    <p className="font-semibold text-white">{athlete.training_results?.single_leg_wall_sit_right || '-'} sec</p>
                                </div>
                                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Core End. (L)</p>
                                    <p className="font-semibold text-white">{athlete.training_results?.core_endurance_left || '-'} sec</p>
                                </div>
                                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Core End. (R)</p>
                                    <p className="font-semibold text-white">{athlete.training_results?.core_endurance_right || '-'} sec</p>
                                </div>
                                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                                    <p className="text-xs font-medium text-slate-400">Bent Arm Hang</p>
                                    <p className="font-semibold text-white">{athlete.training_results?.bent_arm_hang || '-'} sec</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/20">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-8 w-8 text-red-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-white">Delete Athlete</h3>
                            <p className="leading-relaxed text-slate-300">
                                Are you sure you want to delete this athlete? This action cannot be undone and all associated training data will be
                                permanently removed.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 border-t border-slate-700 pt-6">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="rounded-lg border border-slate-600 bg-slate-800 px-6 py-3 text-white transition-all duration-200 hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirmation)}
                                className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-red-800"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
