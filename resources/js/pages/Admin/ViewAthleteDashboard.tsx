import { Head, router } from '@inertiajs/react';
import { Calendar, ChevronRight, Edit, Menu, Save, Trophy, User, X } from 'lucide-react';
import { useState } from 'react';

interface AthleteData {
    id: number;
    username: string;
    email: string;
}

interface BlockData {
    id: number;
    block_number: number;
    start_date: string;
    end_date: string;
    duration_weeks: number;
}

interface XpInfoData {
    total_xp: number;
    current_level: number;
    next_level: number;
}

interface ViewAthleteDashboardProps {
    athlete: AthleteData;
    blocks: BlockData[];
    strengthLevel: number;
    consistencyScore: number;
    xpInfo: XpInfoData;
    routes: {
        [key: string]: string;
    };
}

const ViewAthleteDashboard: React.FC<ViewAthleteDashboardProps> = ({ athlete, blocks, strengthLevel, consistencyScore, xpInfo, routes }) => {
    const [editing, setEditing] = useState(false);
    const [editedBlocks, setEditedBlocks] = useState(blocks);
    const [startDate, setStartDate] = useState<string>('');
    const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(1);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const updateAllBlockDates = (date: string, blockNumber: number) => {
        const newStartDate = new Date(date);

        // Create updated blocks with cascading dates
        const updatedBlocks = [...editedBlocks].map((block) => {
            // Only update this block and following blocks
            if (block.block_number >= blockNumber) {
                // Calculate the start date for this block
                const blockStartDate = new Date(newStartDate);

                // For blocks after the selected one, add 14 weeks per previous block
                if (block.block_number > blockNumber) {
                    const blocksToSkip = block.block_number - blockNumber;
                    blockStartDate.setDate(blockStartDate.getDate() + blocksToSkip * 14 * 7 + blocksToSkip); // 14 weeks + 1 day between blocks
                }

                // Calculate end date (start date + 14 weeks - 1 day)
                const blockEndDate = new Date(blockStartDate);
                blockEndDate.setDate(blockEndDate.getDate() + 14 * 7 - 1);

                return {
                    ...block,
                    start_date: blockStartDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                    end_date: blockEndDate.toISOString().split('T')[0],
                };
            }
            // Return unchanged for blocks before the selected one
            return block;
        });

        setEditedBlocks(updatedBlocks);
    };

    const saveChanges = () => {
        console.log('Saving blocks:', editedBlocks);

        router.post(
            routes['admin.update.block.dates'],
            {
                athlete_id: athlete.id,
                blocks: editedBlocks.map((block) => ({
                    id: block.id,
                    start_date: block.start_date,
                    end_date: block.end_date,
                })),
            },
            {
                onSuccess: (page) => {
                    setEditing(false);
                    console.log('Success response:', page);
                },
                onError: (errors) => {
                    console.error('Error saving blocks:', errors);
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            <Head title={`Viewing ${athlete.username}'s Block`} />

            {/* Sidebar */}
            {/* Mobile Sidebar Menu */}
            <div className="lg:hidden">
                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="fixed top-4 left-4 z-20 rounded-full bg-[#1e3a5f] p-2 text-white shadow-lg"
                >
                    {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Mobile Sidebar Overlay */}
                {mobileSidebarOpen && (
                    <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setMobileSidebarOpen(false)} />
                )}

                {/* Mobile Sidebar Content */}
                <div
                    className={`fixed top-0 left-0 z-20 h-full w-64 transform bg-[#0a1e3c] shadow-xl transition-transform duration-300 ${
                        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-16 items-center border-b border-[#1e3a5f] px-6">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                            <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">AthleteTrack</h1>
                    </div>
                    <div className="border-b border-[#1e3a5f] p-4">
                        <div className="flex items-center">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f]">
                                <User className="h-5 w-5 text-[#4a90e2]" />
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-white">Admin View</h2>
                                <p className="text-xs text-[#a3c0e6]">Viewing as {athlete.username}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <nav className="space-y-2">
                            <a
                                href="#"
                                onClick={() => router.get(`/admin/dashboard`)}
                                className="flex items-center rounded-lg bg-[#1e3a5f]/50 px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]"
                            >
                                <ChevronRight className="mr-3 h-5 w-5" />
                                <span>Return to Admin</span>
                            </a>
                            <a href="#" className="flex items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/50">
                                <Calendar className="mr-3 h-5 w-5" />
                                <span>View Training Blocks</span>
                            </a>
                            <a href="#" className="flex items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/50">
                                <User className="mr-3 h-5 w-5" />
                                <span>Athlete Profile</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="fixed z-10 hidden h-full w-64 border-r border-[#1e3a5f] bg-[#0a1e3c] lg:block">
                <div className="flex h-16 items-center border-b border-[#1e3a5f] px-6">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                        <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white">AthleteTrack</h1>
                </div>
                <div className="border-b border-[#1e3a5f] p-4">
                    <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f]">
                            <User className="h-5 w-5 text-[#4a90e2]" />
                        </div>
                        <div>
                            <h2 className="text-sm font-medium text-white">Admin View</h2>
                            <p className="text-xs text-[#a3c0e6]">Viewing as {athlete.username}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <nav className="space-y-2">
                        <a
                            href="#"
                            onClick={() => router.get(`/admin/dashboard`)}
                            className="flex items-center rounded-lg bg-[#1e3a5f]/50 px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]"
                        >
                            <ChevronRight className="mr-3 h-5 w-5" />
                            <span>Return to Admin</span>
                        </a>
                        <a href="#" className="flex items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/50">
                            <Calendar className="mr-3 h-5 w-5" />
                            <span>View Training Blocks</span>
                        </a>
                        <a href="#" className="flex items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/50">
                            <User className="mr-3 h-5 w-5" />
                            <span>Athlete Profile</span>
                        </a>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-0 w-full flex-1 lg:ml-64">
                <header className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-4 py-4 backdrop-blur-md lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center">
                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a5f] text-[#4a90e2] lg:hidden">
                                <Trophy className="h-4 w-4" />
                            </div>
                            <h1 className="text-xl font-bold text-white lg:text-2xl">Viewing {athlete.username}'s Block</h1>
                        </div>
                        <button
                            onClick={() => (editing ? saveChanges() : setEditing(true))}
                            className={`flex w-full items-center justify-center rounded-lg px-4 py-2 sm:w-auto ${
                                editing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {editing ? (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Block Dates
                                </>
                            )}
                        </button>
                    </div>
                </header>

                <main className="px-4 py-6 lg:px-8">
                    {/* Admin Panel Banner */}
                    <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 shadow-md">
                        <h2 className="mb-2 text-lg font-semibold text-amber-200">Admin View Mode</h2>
                        <p className="text-amber-100">
                            You are viewing this dashboard as administrator. Any changes to block dates will affect the student's training schedule.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-[#1e3a5f] bg-[#112845] p-4 shadow-lg transition-colors hover:bg-[#173356]">
                            <h3 className="mb-2 text-sm font-medium text-[#a3c0e6]">ATHLETE NAME</h3>
                            <p className="text-xl font-bold text-white">{athlete.username}</p>
                            <p className="mt-1 text-xs text-[#63b3ed]">{athlete.email}</p>
                        </div>

                        <div className="rounded-xl border border-[#1e3a5f] bg-[#112845] p-4 shadow-lg transition-colors hover:bg-[#173356]">
                            <h3 className="mb-2 text-sm font-medium text-[#a3c0e6]">STRENGTH LEVEL</h3>
                            <div className="flex items-end">
                                <p className="text-2xl font-bold text-white">{strengthLevel}</p>
                                {xpInfo?.next_level && <p className="ml-2 text-xs text-[#63b3ed]">Next: {xpInfo.next_level}</p>}
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="h-1.5 w-full rounded-full bg-[#1e3a5f]">
                                    <div
                                        className="h-1.5 rounded-full bg-gradient-to-r from-[#4a90e2] to-[#63b3ed]"
                                        style={{ width: `${(xpInfo.total_xp / (xpInfo.next_level * 5)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-[#63b3ed]">{xpInfo.total_xp} XP Total</p>
                        </div>

                        <div className="rounded-xl border border-[#1e3a5f] bg-[#112845] p-4 shadow-lg transition-colors hover:bg-[#173356]">
                            <h3 className="mb-2 text-sm font-medium text-[#a3c0e6]">CONSISTENCY SCORE</h3>
                            <p className="text-2xl font-bold text-white">{consistencyScore}%</p>
                            <div className="mt-2 flex items-center">
                                <div className="h-1.5 w-full rounded-full bg-[#1e3a5f]">
                                    <div
                                        className="h-1.5 rounded-full bg-gradient-to-r from-[#2ecc71] to-[#27ae60]"
                                        style={{ width: `${consistencyScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#1e3a5f] bg-[#112845] p-4 shadow-lg transition-colors hover:bg-[#173356]">
                            <h3 className="mb-2 text-sm font-medium text-[#a3c0e6]">QUICK ACTIONS</h3>
                            <a
                                href="#"
                                onClick={() => router.get(`/admin/dashboard`)}
                                className="mb-2 flex items-center rounded-lg bg-[#1e3a5f]/50 px-3 py-2 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]"
                            >
                                <ChevronRight className="mr-1 h-4 w-4" />
                                <span className="text-sm">Return to Admin</span>
                            </a>
                        </div>
                    </div>

                    {editing && (
                        <div className="mb-6 rounded-xl border border-blue-500/30 bg-[#112845] p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-semibold text-white">Edit Block Dates</h3>
                            <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4">
                                <div className="w-full md:w-auto">
                                    <label htmlFor="blockSelect" className="mb-2 block text-sm font-medium text-[#a3c0e6]">
                                        Select Block:
                                    </label>
                                    <select
                                        id="blockSelect"
                                        className="w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-2 text-white focus:border-[#4a90e2] focus:outline-none"
                                        onChange={(e) => setSelectedBlockNumber(parseInt(e.target.value, 10))}
                                        value={selectedBlockNumber}
                                    >
                                        {editedBlocks.map((block) => (
                                            <option key={block.id} value={block.block_number}>
                                                Block {block.block_number}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-[#a3c0e6]">
                                        New Start Date:
                                    </label>
                                    <input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full rounded-lg border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-2 text-white focus:border-[#4a90e2] focus:outline-none"
                                    />
                                </div>

                                <button
                                    onClick={() => updateAllBlockDates(startDate, selectedBlockNumber)}
                                    disabled={!startDate}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 md:w-auto"
                                >
                                    Apply to Block {selectedBlockNumber} & Following
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-blue-400">
                                This will update Block {selectedBlockNumber} and all following blocks, with each block starting after the previous one
                                ends. Earlier blocks will remain unchanged.
                            </p>
                        </div>
                    )}

                    {/* Blocks Table */}
                    <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                        <div className="border-b border-[#1e3a5f] bg-[#0a1e3c] px-6 py-4">
                            <h2 className="text-lg font-semibold text-white">Training Blocks</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#1e3a5f]">
                                <thead className="bg-[#0a1e3c]/60">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#4a90e2] uppercase">Block</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#4a90e2] uppercase">
                                            Start Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#4a90e2] uppercase">End Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#4a90e2] uppercase">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e3a5f]">
                                    {editedBlocks.map((block) => (
                                        <tr key={block.id} className="transition-colors hover:bg-[#1e3a5f]/20">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Calendar className="mr-2 h-5 w-5 text-[#4a90e2]" />
                                                    <span className="font-medium text-white">Block {block.block_number}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#a3c0e6]">{formatDate(block.start_date)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#a3c0e6]">{formatDate(block.end_date)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#a3c0e6]">{block.duration_weeks} weeks</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile friendly table alternative for small screens */}
                    <div className="mt-6 block sm:hidden">
                        <h3 className="mb-4 text-lg font-semibold text-white">Training Blocks (Mobile View)</h3>
                        <div className="space-y-4">
                            {editedBlocks.map((block) => (
                                <div key={block.id} className="rounded-lg border border-[#1e3a5f] bg-[#112845] p-4 shadow-md">
                                    <div className="mb-2 flex items-center">
                                        <Calendar className="mr-2 h-5 w-5 text-[#4a90e2]" />
                                        <span className="font-medium text-white">Block {block.block_number}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-xs text-[#a3c0e6]">START DATE</p>
                                            <p className="text-white">{formatDate(block.start_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#a3c0e6]">END DATE</p>
                                            <p className="text-white">{formatDate(block.end_date)}</p>
                                        </div>
                                        <div className="col-span-2 mt-1">
                                            <p className="text-xs text-[#a3c0e6]">DURATION</p>
                                            <p className="text-white">{block.duration_weeks} weeks</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {editing && (
                        <div className="mt-4 text-sm text-[#a3c0e6]">
                            <p>⚠️ Changing block dates will automatically adjust the release dates of all sessions within each block.</p>
                        </div>
                    )}

                    {/* Mobile Bottom Navigation Bar */}
                    <div className="fixed right-0 bottom-0 left-0 z-10 flex justify-around border-t border-[#1e3a5f] bg-[#0a1e3c]/90 p-4 backdrop-blur-md lg:hidden">
                        <button onClick={() => router.get(`/admin/dashboard`)} className="flex flex-col items-center text-[#a3c0e6]">
                            <ChevronRight className="h-6 w-6" />
                            <span className="mt-1 text-xs">Admin</span>
                        </button>
                        <button onClick={() => (editing ? saveChanges() : setEditing(true))} className="flex flex-col items-center text-[#a3c0e6]">
                            {editing ? <Save className="h-6 w-6" /> : <Edit className="h-6 w-6" />}
                            <span className="mt-1 text-xs">{editing ? 'Save' : 'Edit'}</span>
                        </button>
                        <button className="flex flex-col items-center text-[#a3c0e6]">
                            <User className="h-6 w-6" />
                            <span className="mt-1 text-xs">Profile</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewAthleteDashboard;
