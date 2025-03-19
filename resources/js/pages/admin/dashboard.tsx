import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';

/** Athlete Type */
type Athlete = {
    id: number;
    username: string;
    email: string;
    training_results?: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        wall_sit: number | null;
        core_endurance: number | null;
        bent_arm_hang: number | null;
    };
};

// Form data type
interface AthleteFormData {
    username: string;
    parentEmail: string;
    password: string;
    standingLongJump: string;
    singleLegJumpLeft: string;
    singleLegJumpRight: string;
    wallSit: string;
    coreEndurance: string;
    bentArmHang: string;
    [key: string]: string | any;
}

type Props = {
    athletes?: Athlete[];
};

export default function AdminDashboard({ athletes: initialAthletes = [] }: Props) {
    // State for athletes (initialized from props)
    const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);

    // State for view mode (table or cards)
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    // Stats for the dashboard
    const numberOfUsers = athletes.length;
    const numberOfActive = athletes.filter((a) => a.training_results !== undefined).length;
    const numberOfOnline = Math.min(numberOfUsers, 1); // Placeholder

    // Form state using the useAthleteForm hook
    const { form, showModal, setShowModal, handleChange, handleSubmit, isSubmitting, error } = useAthleteForm(athletes, setAthletes);

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            {/* MAIN CONTENT AREA */}
            <div className="space-y-6 px-2 sm:px-4 lg:px-0">
                {/* Top Section: "Add Athlete" button + Stats Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Button to open the Add Athlete modal */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow hover:from-blue-500 hover:to-indigo-500"
                    >
                        Add Athlete
                    </button>

                    {/* Stats Row */}
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:w-auto">
                        <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
                            <CardHeader>
                                <CardTitle className="tracking-wide uppercase">Number of Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{numberOfUsers}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md">
                            <CardHeader>
                                <CardTitle className="tracking-wide uppercase">Number of Active</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{numberOfActive}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md">
                            <CardHeader>
                                <CardTitle className="tracking-wide uppercase">How Many Online</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{numberOfOnline}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`rounded-md px-4 py-2 ${
                                viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Table View
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`rounded-md px-4 py-2 ${
                                viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Card View
                        </button>
                    </div>
                </div>

                {/* Athlete Cards View */}
                {viewMode === 'cards' && athletes.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Add Athlete Card */}
                        <div
                            onClick={() => setShowModal(true)}
                            className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-8 w-8"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Add Athlete</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new athlete to your team</p>
                        </div>

                        {/* Athlete Cards */}
                        {athletes.map((athlete) => (
                            <Card key={athlete.id} className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                    <CardTitle>{athlete.username}</CardTitle>
                                    <p className="text-sm text-gray-100">{athlete.email}</p>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Pre-Training Results</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="font-medium text-gray-600 dark:text-gray-300">Standing Long Jump:</p>
                                            <p>{athlete.training_results?.standing_long_jump || '-'} cm</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-600 dark:text-gray-300">Single Leg Jump (L):</p>
                                            <p>{athlete.training_results?.single_leg_jump_left || '-'} cm</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-600 dark:text-gray-300">Single Leg Jump (R):</p>
                                            <p>{athlete.training_results?.single_leg_jump_right || '-'} cm</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-600 dark:text-gray-300">Wall Sit:</p>
                                            <p>{athlete.training_results?.wall_sit || '-'} sec</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-600 dark:text-gray-300">Core Endurance:</p>
                                            <p>{athlete.training_results?.core_endurance || '-'} sec</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-600 dark:text-gray-300">Bent Arm Hang:</p>
                                            <p>{athlete.training_results?.bent_arm_hang || '-'} sec</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Table of Athletes */}
                {viewMode === 'table' && athletes.length > 0 && (
                    <Card className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>List of Athletes</CardTitle>
                            <button
                                onClick={() => setShowModal(true)}
                                className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm text-white shadow hover:from-blue-500 hover:to-indigo-500"
                            >
                                Add Athlete
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-x-auto shadow sm:rounded-lg">
                                <table className="w-full table-auto text-left text-sm text-gray-700 dark:text-gray-400">
                                    <thead className="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-200">
                                        <tr>
                                            <th scope="col" className="px-4 py-2">
                                                Username
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Email
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Standing Long Jump
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Single Leg Jump (Left)
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Single Leg Jump (Right)
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Wall Sit
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Core Endurance
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Bent Arm Hang
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {athletes.map((athlete) => (
                                            <tr
                                                key={athlete.id}
                                                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                            >
                                                <td className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                                    {athlete.username}
                                                </td>
                                                <td className="px-4 py-2">{athlete.email}</td>
                                                <td className="px-4 py-2">{athlete.training_results?.standing_long_jump || '-'}</td>
                                                <td className="px-4 py-2">{athlete.training_results?.single_leg_jump_left || '-'}</td>
                                                <td className="px-4 py-2">{athlete.training_results?.single_leg_jump_right || '-'}</td>
                                                <td className="px-4 py-2">{athlete.training_results?.wall_sit || '-'}</td>
                                                <td className="px-4 py-2">{athlete.training_results?.core_endurance || '-'}</td>
                                                <td className="px-4 py-2">{athlete.training_results?.bent_arm_hang || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* "No Athletes" message when there are no athletes */}
                {athletes.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-12 w-12 text-gray-400 dark:text-gray-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Athletes Found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new athlete to your team.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow hover:from-blue-500 hover:to-indigo-500"
                        >
                            Add Your First Athlete
                        </button>
                    </div>
                )}
            </div>

            {/* MODAL for Adding a New Athlete */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    {/* Modal Content */}
                    <div className="w-full max-w-2xl rounded-lg bg-gray-100 p-6 shadow-md dark:bg-gray-800">
                        <div className="mb-2 border-b pb-2">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add New Athlete</h2>
                        </div>
                        {error && <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Basic fields */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Athlete Username</label>
                                    <input
                                        name="username"
                                        type="text"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="Athlete Username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Parent Email</label>
                                    <input
                                        name="parentEmail"
                                        type="email"
                                        value={form.parentEmail}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="Parent Email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="Password"
                                    />
                                </div>
                            </div>

                            {/* Pre-Training Testing Results */}
                            <p className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-100">Pre-Training Testing Results</p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">Standing Long Jump (cm)</label>
                                    <input
                                        name="standingLongJump"
                                        type="number"
                                        value={form.standingLongJump}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="e.g. 150"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
                                        Single Leg Jump (Left) (cm)
                                    </label>
                                    <input
                                        name="singleLegJumpLeft"
                                        type="number"
                                        value={form.singleLegJumpLeft}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="e.g. 130"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
                                        Single Leg Jump (Right) (cm)
                                    </label>
                                    <input
                                        name="singleLegJumpRight"
                                        type="number"
                                        value={form.singleLegJumpRight}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="e.g. 135"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">Wall Sit (seconds)</label>
                                    <input
                                        name="wallSit"
                                        type="number"
                                        value={form.wallSit}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="e.g. 60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">Core Endurance (seconds)</label>
                                    <input
                                        name="coreEndurance"
                                        type="number"
                                        value={form.coreEndurance}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="e.g. 90"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">Bent Arm Hang (seconds)</label>
                                    <input
                                        name="bentArmHang"
                                        type="number"
                                        value={form.bentArmHang}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:text-black"
                                        placeholder="e.g. 20"
                                    />
                                </div>
                            </div>

                            {/* Modal Buttons */}
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 font-semibold text-white shadow hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Athlete'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

// Custom hook for athlete form handling
function useAthleteForm(athletes: Athlete[], setAthletes: React.Dispatch<React.SetStateAction<Athlete[]>>) {
    // Form state
    const [form, setForm] = useState<AthleteFormData>({
        username: '',
        parentEmail: '',
        password: '',
        standingLongJump: '',
        singleLegJumpLeft: '',
        singleLegJumpRight: '',
        wallSit: '',
        coreEndurance: '',
        bentArmHang: '',
    });

    // Modal state
    const [showModal, setShowModal] = useState(false);

    // Loading and error states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    // Using Inertia.js for form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        interface InertiaPage {
            props: {
                flash?: {
                    newAthlete?: Athlete;
                    [key: string]: any;
                };
                [key: string]: any;
            };
        }

        router.post('/athletes', form, {
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onSuccess: (page: InertiaPage) => {
                // Reset form
                setForm({
                    username: '',
                    parentEmail: '',
                    password: '',
                    standingLongJump: '',
                    singleLegJumpLeft: '',
                    singleLegJumpRight: '',
                    wallSit: '',
                    coreEndurance: '',
                    bentArmHang: '',
                });

                // Close modal
                setShowModal(false);

                // If there's a new athlete in the response, update the local state
                if (page.props.flash && page.props.flash.newAthlete) {
                    setAthletes([...athletes, page.props.flash.newAthlete]);
                }
            },
            onError: (errors: Record<string, string>) => {
                const errorMessage = Object.values(errors)[0] || 'An error occurred';
                setError(errorMessage);
            },
        });
    };

    return {
        form,
        showModal,
        setShowModal,
        handleChange,
        handleSubmit,
        isSubmitting,
        error,
    };
}
