import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Athlete = {
    id: number;
    username: string;
    email: string;
    consistency_score?: number; // Add consistency score
    strength_level?: number; // Add strength level
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

interface AthleteTableProps {
    athletes: Athlete[];
    onAddClick: () => void;
}

export default function AthleteTable({ athletes, onAddClick }: AthleteTableProps) {
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
    const [actionsMenu, setActionsMenu] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActionsMenu(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Function to handle the deletion
    const handleDelete = (id: number) => {
        router.delete(`/admin/athletes/${id}`, {
            onSuccess: () => {
                // Close the confirmation modal
                setDeleteConfirmation(null);

                // Refresh the page
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
        // Use the updated route that will log in as student
        router.get(`/admin/athletes/${id}/dashboard`);
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 shadow-xl">
            {/* Header with stats summary */}
            <div className="bg-gradient-to-r from-blue-900/70 to-indigo-900/70 p-4">
                <h2 className="text-xl font-bold text-white">Athletes Dashboard</h2>
                <p className="text-sm text-blue-300">Track performance and manage athlete progress</p>
            </div>

            {/* Table with improved styling */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-800/70">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Athlete
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Strength
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Consistency
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Standing Jump
                            </th>
                            <th
                                scope="col"
                                className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase lg:table-cell"
                            >
                                SL Jump (L/R)
                            </th>
                            <th
                                scope="col"
                                className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase lg:table-cell"
                            >
                                Wall Sit (L/R)
                            </th>
                            <th
                                scope="col"
                                className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase lg:table-cell"
                            >
                                Core (L/R)
                            </th>
                            <th
                                scope="col"
                                className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase lg:table-cell"
                            >
                                Bent Arm
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                        {athletes.map((athlete) => (
                            <tr
                                key={athlete.id}
                                className="cursor-pointer transition-colors hover:bg-blue-900/20"
                                onClick={() => handleEdit(athlete.id)}
                            >
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="flex items-center">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white">
                                                {athlete.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-white">{athlete.username}</div>
                                                <div className="text-xs text-gray-400">{athlete.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Strength Level */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-md ${getStrengthLevelColor(athlete.strength_level || 1)}`}
                                        >
                                            <span className="text-xs font-bold text-white">{athlete.strength_level || 1}</span>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-300">Level</span>
                                    </div>
                                </td>

                                {/* Consistency Score */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <div className="h-2 w-full rounded-full bg-gray-700">
                                            <div
                                                className={`h-2 rounded-full ${getConsistencyColor(athlete.consistency_score || 0)}`}
                                                style={{ width: `${athlete.consistency_score || 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="mt-1 text-xs text-gray-400">{athlete.consistency_score || 0}%</span>
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-300">
                                    {athlete.training_results?.standing_long_jump ? (
                                        <span className="font-medium text-blue-400">{athlete.training_results.standing_long_jump}</span>
                                    ) : (
                                        <span className="text-gray-500">-</span>
                                    )}{' '}
                                    cm
                                </td>

                                <td className="hidden px-4 py-4 text-sm whitespace-nowrap text-gray-300 lg:table-cell">
                                    <div className="flex space-x-2">
                                        <span>
                                            {athlete.training_results?.single_leg_jump_left ? (
                                                <span className="font-medium text-blue-400">{athlete.training_results.single_leg_jump_left}</span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </span>
                                        <span className="text-gray-500">/</span>
                                        <span>
                                            {athlete.training_results?.single_leg_jump_right ? (
                                                <span className="font-medium text-blue-400">{athlete.training_results.single_leg_jump_right}</span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </span>
                                    </div>
                                </td>

                                <td className="hidden px-4 py-4 text-sm whitespace-nowrap text-gray-300 lg:table-cell">
                                    <div className="flex space-x-2">
                                        <span>
                                            {athlete.training_results?.single_leg_wall_sit_left ? (
                                                <span className="font-medium text-blue-400">{athlete.training_results.single_leg_wall_sit_left}</span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </span>
                                        <span className="text-gray-500">/</span>
                                        <span>
                                            {athlete.training_results?.single_leg_wall_sit_right ? (
                                                <span className="font-medium text-blue-400">
                                                    {athlete.training_results.single_leg_wall_sit_right}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </span>
                                    </div>
                                </td>

                                <td className="hidden px-4 py-4 text-sm whitespace-nowrap text-gray-300 lg:table-cell">
                                    <div className="flex space-x-2">
                                        <span>
                                            {athlete.training_results?.core_endurance_left ? (
                                                <span className="font-medium text-blue-400">{athlete.training_results.core_endurance_left}</span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </span>
                                        <span className="text-gray-500">/</span>
                                        <span>
                                            {athlete.training_results?.core_endurance_right ? (
                                                <span className="font-medium text-blue-400">{athlete.training_results.core_endurance_right}</span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </span>
                                    </div>
                                </td>

                                <td className="hidden px-4 py-4 text-sm whitespace-nowrap text-gray-300 lg:table-cell">
                                    {athlete.training_results?.bent_arm_hang ? (
                                        <span className="font-medium text-blue-400">{athlete.training_results.bent_arm_hang}</span>
                                    ) : (
                                        <span className="text-gray-500">-</span>
                                    )}{' '}
                                    sec
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add the "Add New Athlete" button at the bottom */}
            <div className="border-t border-gray-800 bg-gray-900/30 p-4">
                <button
                    onClick={onAddClick}
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 sm:w-auto"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mr-2 h-5 w-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New Athlete
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation !== null && (
                <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="animate-fade-in-down w-full max-w-md rounded-lg border border-gray-700 bg-gradient-to-b from-[#112845] to-[#0a1e3c] p-6 shadow-xl">
                        <div className="mb-5 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-8 w-8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Delete Athlete</h3>
                            <p className="text-gray-300">
                                Are you sure you want to delete this athlete? This action cannot be undone and all associated training data will be
                                permanently removed.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 border-t border-gray-700 pt-3">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirmation)}
                                className="rounded-md bg-gradient-to-r from-red-600 to-red-800 px-4 py-2 text-white transition-colors hover:from-red-700 hover:to-red-900"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

// Helper functions for color coding
function getStrengthLevelColor(level: number): string {
    if (level >= 8) return 'bg-gradient-to-br from-purple-600 to-indigo-700';
    if (level >= 6) return 'bg-gradient-to-br from-blue-600 to-blue-700';
    if (level >= 4) return 'bg-gradient-to-br from-green-600 to-green-700';
    if (level >= 2) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-br from-gray-500 to-gray-600';
}

function getConsistencyColor(score: number): string {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (score >= 20) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
}
