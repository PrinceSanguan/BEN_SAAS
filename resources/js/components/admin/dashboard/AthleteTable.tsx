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
        core_endurance: number | null;
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
        <div className="overflow-hidden rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-800/70">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Athlete
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Standing Jump
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Single Leg Jump (L)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Single Leg Jump (R)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Wall Sit (L)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Wall Sit (R)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Core
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Bent Arm
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                        {athletes.map((athlete) => (
                            <tr key={athlete.id} className="cursor-pointer hover:bg-gray-800/30" onClick={() => handleEdit(athlete.id)}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-white">{athlete.username}</div>
                                        <div className="text-xs text-gray-400">{athlete.email}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                                    {athlete.training_results?.standing_long_jump || '-'} cm
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                                    {athlete.training_results?.single_leg_jump_left || '-'} cm
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                                    {athlete.training_results?.single_leg_jump_right || '-'} cm
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                                    {athlete.training_results?.single_leg_wall_sit_left || '-'} sec
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                                    {athlete.training_results?.single_leg_wall_sit_right || '-'} sec
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                                    {athlete.training_results?.core_endurance || '-'} sec
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                                    {athlete.training_results?.bent_arm_hang || '-'} sec
                                </td>
                                <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                                    <div className="relative inline-block text-left">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActionsMenu(actionsMenu === athlete.id ? null : athlete.id);
                                            }}
                                            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
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

                                        {actionsMenu === athlete.id && (
                                            <div
                                                ref={menuRef}
                                                className="ring-opacity-5 absolute right-0 z-10 mt-2 w-48 rounded-md bg-gray-800 shadow-lg ring-1 ring-black"
                                            >
                                                <div className="py-1" role="menu" aria-orientation="vertical">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(athlete.id);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        <div className="flex items-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="mr-2 h-4 w-4"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                                />
                                                            </svg>
                                                            Edit Athlete
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewDashboard(athlete.id);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        <div className="flex items-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="mr-2 h-4 w-4"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                                                                />
                                                            </svg>
                                                            View Dashboard
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirmation(athlete.id);
                                                            setActionsMenu(null);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-700/30 hover:text-red-200"
                                                        role="menuitem"
                                                    >
                                                        <div className="flex items-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="mr-2 h-4 w-4"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                                />
                                                            </svg>
                                                            Delete
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
