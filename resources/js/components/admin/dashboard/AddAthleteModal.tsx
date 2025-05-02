import React from 'react';

interface AddAthleteModalProps {
    showModal: boolean;
    showConfirmation: boolean;
    form: any;
    error: string | null;
    isSubmitting: boolean;
    formattedData: any;
    onClose: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleCheckboxChange: (field: string, checked: boolean) => void;
    confirmSubmit: () => void;
    cancelSubmit: () => void;
}

export default function AddAthleteModal({
    showModal,
    showConfirmation,
    form,
    error,
    isSubmitting,
    formattedData,
    onClose,
    handleChange,
    handleSubmit,
    handleCheckboxChange,
    confirmSubmit,
    cancelSubmit,
}: AddAthleteModalProps) {
    if (!showModal) return null;

    return (
        <>
            {/* Main Modal */}
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black">
                <div className="relative max-h-full w-full max-w-md p-4">
                    <div className="relative rounded-lg bg-gradient-to-b from-[#112845] to-[#0a1e3c] shadow">
                        {/* Modal header */}
                        <div className="flex items-center justify-between rounded-t border-b border-gray-600 p-4 md:p-5">
                            <h3 className="text-xl font-semibold text-white">Add New Athlete</h3>
                            <button
                                onClick={onClose}
                                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                                <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {/* Error alert */}
                        {error && (
                            <div className="mx-4 mt-4 flex items-center rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="mr-2 h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                    />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Modal body */}
                        <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-5">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Username */}
                                <div className="col-span-2">
                                    <label htmlFor="username" className="mb-2 block text-sm font-medium text-white">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="johndoe123"
                                        required
                                    />
                                </div>

                                {/* Parent Email */}
                                <div className="col-span-2">
                                    <label htmlFor="parentEmail" className="mb-2 block text-sm font-medium text-white">
                                        Parent Email
                                    </label>
                                    <input
                                        type="email"
                                        name="parentEmail"
                                        id="parentEmail"
                                        value={form.parentEmail}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="parent@example.com"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="col-span-2">
                                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                {/* Standing Long Jump */}
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="standingLongJump" className="mb-2 block text-sm font-medium text-white">
                                        Standing Long Jump (cm)
                                    </label>
                                    <input
                                        type="number"
                                        name="standingLongJump"
                                        id="standingLongJump"
                                        value={form.standingLongJump}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="175"
                                    />
                                </div>

                                {/* Single Leg Jump Left */}
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="singleLegJumpLeft" className="mb-2 block text-sm font-medium text-white">
                                        Single Leg Jump Left (cm)
                                    </label>
                                    <input
                                        type="number"
                                        name="singleLegJumpLeft"
                                        id="singleLegJumpLeft"
                                        value={form.singleLegJumpLeft}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="90"
                                    />
                                </div>

                                {/* Single Leg Jump Right */}
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="singleLegJumpRight" className="mb-2 block text-sm font-medium text-white">
                                        Single Leg Jump Right (cm)
                                    </label>
                                    <input
                                        type="number"
                                        name="singleLegJumpRight"
                                        id="singleLegJumpRight"
                                        value={form.singleLegJumpRight}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="95"
                                    />
                                </div>

                                {/* Single Leg Wall Sit Left */}
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="singleLegWallSitLeft" className="mb-2 block text-sm font-medium text-white">
                                        Single Leg Wall Sit Left (sec)
                                    </label>
                                    <input
                                        type="number"
                                        name="singleLegWallSitLeft"
                                        id="singleLegWallSitLeft"
                                        value={form.singleLegWallSitLeft}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="30"
                                    />
                                </div>

                                {/* Single Leg Wall Sit Right */}
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="singleLegWallSitRight" className="mb-2 block text-sm font-medium text-white">
                                        Single Leg Wall Sit Right (sec)
                                    </label>
                                    <input
                                        type="number"
                                        name="singleLegWallSitRight"
                                        id="singleLegWallSitRight"
                                        value={form.singleLegWallSitRight}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="32"
                                    />
                                </div>

                                {/* Core Endurance Left */}
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="coreEnduranceLeft" className="mb-2 block text-sm font-medium text-white">
                                        Core Endurance Left (sec)
                                    </label>
                                    <input
                                        type="number"
                                        name="coreEnduranceLeft"
                                        id="coreEnduranceLeft"
                                        value={form.coreEnduranceLeft}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="60"
                                    />
                                </div>

                                {/* Core Endurance Right */}
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="coreEnduranceRight" className="mb-2 block text-sm font-medium text-white">
                                        Core Endurance Right (sec)
                                    </label>
                                    <input
                                        type="number"
                                        name="coreEnduranceRight"
                                        id="coreEnduranceRight"
                                        value={form.coreEnduranceRight}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="60"
                                    />
                                </div>

                                {/* Bent Arm Hang Checkbox */}
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="bentArmHangEnabled"
                                            checked={form.bentArmHangEnabled}
                                            onChange={(e) => handleCheckboxChange('bentArmHangEnabled', e.target.checked)}
                                            className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                        />
                                        <label htmlFor="bentArmHangEnabled" className="ms-2 text-sm font-medium text-white">
                                            Bent Arm Hang Enabled
                                        </label>
                                    </div>
                                </div>

                                {/* Bent Arm Hang (only shown if enabled) */}
                                {form.bentArmHangEnabled && (
                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="bentArmHang" className="mb-2 block text-sm font-medium text-white">
                                            Bent Arm Hang (sec)
                                        </label>
                                        <input
                                            type="number"
                                            name="bentArmHang"
                                            id="bentArmHang"
                                            value={form.bentArmHang}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="25"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg border border-gray-600 bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-600 focus:outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Athlete'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && formattedData && (
                <div className="bg-opacity-70 fixed inset-0 z-[60] flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black">
                    <div className="relative max-h-full w-full max-w-md p-4">
                        <div className="animate-fade-in-down relative rounded-lg bg-gradient-to-b from-[#112845] to-[#0a1e3c] shadow">
                            {/* Modal header */}
                            <div className="flex items-center justify-between rounded-t border-b border-gray-600 p-4 md:p-5">
                                <h3 className="text-xl font-semibold text-white">Confirm Addition</h3>
                            </div>

                            {/* Modal body */}
                            <div className="p-4 md:p-5">
                                <div className="mb-4 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-white">Are you sure you want to add this athlete?</h3>
                                    <p className="text-gray-400">
                                        You are about to add <span className="font-semibold text-white">{formattedData.username}</span> with the email{' '}
                                        <span className="font-semibold text-white">{formattedData.parent_email}</span>.
                                    </p>
                                </div>

                                <div className="mb-4 rounded-lg bg-gray-800/50 p-3">
                                    <h4 className="mb-2 text-sm font-medium text-blue-400">Pre-Training Results:</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="rounded bg-gray-700/50 p-2">
                                            <p className="font-medium text-gray-400">Standing Long Jump:</p>
                                            <p className="text-white">{formattedData.training_results.standing_long_jump || '-'} cm</p>
                                        </div>
                                        <div className="rounded bg-gray-700/50 p-2">
                                            <p className="font-medium text-gray-400">Single Leg Jump (L):</p>
                                            <p className="text-white">{formattedData.training_results.single_leg_jump_left || '-'} cm</p>
                                        </div>
                                        <div className="rounded bg-gray-700/50 p-2">
                                            <p className="font-medium text-gray-400">Single Leg Jump (R):</p>
                                            <p className="text-white">{formattedData.training_results.single_leg_jump_right || '-'} cm</p>
                                        </div>
                                        <div className="rounded bg-gray-700/50 p-2">
                                            <p className="font-medium text-gray-400">Bent Arm Hang:</p>
                                            <p className="text-white">{formattedData.training_results.bent_arm_hang || '-'} sec</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-3 pt-2">
                                    <button
                                        onClick={cancelSubmit}
                                        type="button"
                                        className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmSubmit}
                                        type="button"
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
