import { Checkbox } from '@/components/ui/checkbox';
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
    bentArmHangEnabled: boolean;
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
    handleCheckboxChange?: (field: string, checked: boolean) => void;
}

export default function AddAthleteModal({
    showModal,
    form,
    error,
    isSubmitting,
    onClose,
    handleChange,
    handleSubmit,
    handleCheckboxChange = (field, checked) => {},
}: AddAthleteModalProps) {
    if (!showModal) return null;

    // Handle click outside modal to close
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-16 backdrop-blur-sm md:items-center md:pt-4"
            onClick={handleBackdropClick}
        >
            {/* Modal Content */}
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                {/* Modal Header - Fixed */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1e3a5f] bg-[#112845] p-4 md:p-6">
                    <h2 className="text-xl font-bold text-white">Add New Athlete</h2>
                    <button onClick={onClose} className="rounded-full p-1 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {error && <div className="mb-4 rounded-lg border border-[#ff5555] bg-[#3a1c1c] p-4 text-[#ff9999]">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic fields */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">Athlete Username</label>
                                <input
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none"
                                    placeholder="Athlete Username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">Parent Email</label>
                                <input
                                    name="parentEmail"
                                    type="email"
                                    value={form.parentEmail}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none"
                                    placeholder="Parent Email"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {/* Pre-Training Testing Results */}
                        <div>
                            <p className="mb-3 text-sm font-medium tracking-wider text-[#4a90e2] uppercase">Pre-Training Testing Results</p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-medium text-[#a3c0e6]">Standing Long Jump (cm)</label>
                                    <input
                                        name="standingLongJump"
                                        type="number"
                                        value={form.standingLongJump}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none"
                                        placeholder="e.g. 150"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#a3c0e6]">Single Leg Jump (Left) (cm)</label>
                                    <input
                                        name="singleLegJumpLeft"
                                        type="number"
                                        value={form.singleLegJumpLeft}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none"
                                        placeholder="e.g. 130"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#a3c0e6]">Single Leg Jump (Right) (cm)</label>
                                    <input
                                        name="singleLegJumpRight"
                                        type="number"
                                        value={form.singleLegJumpRight}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none"
                                        placeholder="e.g. 135"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#a3c0e6]">Wall Sit (seconds)</label>
                                    <input
                                        name="wallSit"
                                        type="number"
                                        value={form.wallSit}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none"
                                        placeholder="e.g. 60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#a3c0e6]">Core Endurance (seconds)</label>
                                    <input
                                        name="coreEndurance"
                                        type="number"
                                        value={form.coreEndurance}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none"
                                        placeholder="e.g. 90"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="text-xs font-medium text-[#a3c0e6]">Bent Arm Hang (seconds)</label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="bentArmHangEnabled"
                                                checked={form.bentArmHangEnabled || false}
                                                onCheckedChange={(checked) => handleCheckboxChange('bentArmHangEnabled', checked as boolean)}
                                            />
                                            <label htmlFor="bentArmHangEnabled" className="cursor-pointer text-xs text-[#a3c0e6]">
                                                Enable
                                            </label>
                                        </div>
                                    </div>
                                    <input
                                        name="bentArmHang"
                                        type="number"
                                        value={form.bentArmHang}
                                        onChange={handleChange}
                                        disabled={!form.bentArmHangEnabled}
                                        className={`mt-1 w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] p-3 text-white placeholder-[#a3c0e6]/50 focus:ring-2 focus:ring-[#4a90e2] focus:outline-none ${!form.bentArmHangEnabled ? 'cursor-not-allowed opacity-50' : ''}`}
                                        placeholder="e.g. 20"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer - Fixed */}
                <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-[#1e3a5f] bg-[#112845] p-4 sm:flex-row sm:justify-end md:p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="order-2 w-full rounded-lg border border-[#1e3a5f] bg-transparent px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f] disabled:opacity-50 sm:order-1 sm:w-auto"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            const form = document.querySelector('form');
                            if (form) {
                                const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                                form.dispatchEvent(formEvent);
                            }
                        }}
                        disabled={isSubmitting}
                        className="order-1 w-full rounded-lg bg-gradient-to-r from-[#4a90e2] to-[#63b3ed] px-4 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-[#3a80d2] hover:to-[#53a3dd] disabled:opacity-50 sm:order-2 sm:w-auto"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Athlete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
