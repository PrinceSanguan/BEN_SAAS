import React from 'react';

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
    [key: string]: string | number | boolean | undefined;
}

interface AddAthleteModalProps {
    showModal: boolean;
    form: AthleteFormData;
    error: string | null;
    isSubmitting: boolean;
    onClose: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddAthleteModal({
    showModal,
    form,
    error,
    isSubmitting,
    onClose,
    handleChange,
    handleSubmit
}: AddAthleteModalProps) {
    if (!showModal) return null;

    return (
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
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
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"
                                placeholder="e.g. 20"
                            />
                        </div>
                    </div>

                    {/* Modal Buttons */}
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
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
    );
}
