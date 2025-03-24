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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            {/* Modal Content */}
            <div className="w-full max-w-2xl rounded-xl bg-[#112845] p-6 shadow-lg border border-[#1e3a5f]">
                <div className="mb-4 border-b border-[#1e3a5f] pb-3">
                    <h2 className="text-xl font-bold text-white">Add New Athlete</h2>
                </div>

                {error && <div className="mb-4 rounded-lg bg-[#3a1c1c] border border-[#ff5555] p-4 text-[#ff9999]">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic fields */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-[#4a90e2] uppercase tracking-wider">Athlete Username</label>
                            <input
                                name="username"
                                type="text"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                                placeholder="Athlete Username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#4a90e2] uppercase tracking-wider">Parent Email</label>
                            <input
                                name="parentEmail"
                                type="email"
                                value={form.parentEmail}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                                placeholder="Parent Email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#4a90e2] uppercase tracking-wider">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {/* Pre-Training Testing Results */}
                    <div className="mt-6">
                        <p className="text-sm font-medium text-[#4a90e2] uppercase tracking-wider mb-3">Pre-Training Testing Results</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-medium text-[#a3c0e6]">Standing Long Jump (cm)</label>
                                <input
                                    name="standingLongJump"
                                    type="number"
                                    value={form.standingLongJump}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                                    placeholder="e.g. 150"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#a3c0e6]">
                                    Single Leg Jump (Left) (cm)
                                </label>
                                <input
                                    name="singleLegJumpLeft"
                                    type="number"
                                    value={form.singleLegJumpLeft}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                                    placeholder="e.g. 130"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#a3c0e6]">
                                    Single Leg Jump (Right) (cm)
                                </label>
                                <input
                                    name="singleLegJumpRight"
                                    type="number"
                                    value={form.singleLegJumpRight}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
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
                                    className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
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
                                    className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                                    placeholder="e.g. 90"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#a3c0e6]">Bent Arm Hang (seconds)</label>
                                <input
                                    name="bentArmHang"
                                    type="number"
                                    value={form.bentArmHang}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg bg-[#0a1e3c] border border-[#1e3a5f] p-2 text-white placeholder-[#a3c0e6]/50 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                                    placeholder="e.g. 20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modal Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-[#1e3a5f] bg-transparent px-4 py-2.5 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f] disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-gradient-to-r from-[#4a90e2] to-[#63b3ed] px-4 py-2.5 font-medium text-white shadow-lg hover:from-[#3a80d2] hover:to-[#53a3dd] transition-all duration-300 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Athlete'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
