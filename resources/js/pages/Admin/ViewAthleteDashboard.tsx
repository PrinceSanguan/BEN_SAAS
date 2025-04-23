import { Head, router } from '@inertiajs/react';
import { Calendar, Edit, Save } from 'lucide-react';
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
    // Add this with your other useState declarations at the top of the component
    const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(1);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Replace the existing updateAllBlockDates function in resources/js/pages/Admin/ViewAthleteDashboard.tsx
    // with this new implementation:

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
        // Debug the data being sent
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
        <div className="min-h-screen bg-gray-100 py-12">
            <Head title={`Viewing ${athlete.username}'s Dashboard`} />

            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-semibold">{athlete.username}'s Dashboard</h1>
                            </div>

                            <button
                                onClick={() => (editing ? saveChanges() : setEditing(true))}
                                className={`flex items-center rounded-md px-4 py-2 ${
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

                        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h2 className="text-lg font-medium text-gray-900">Strength Level</h2>
                                <p className="text-3xl font-bold text-blue-600">{strengthLevel}</p>
                                <p className="text-sm text-gray-500">XP: {xpInfo.total_xp}</p>
                            </div>

                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h2 className="text-lg font-medium text-gray-900">Consistency Score</h2>
                                <p className="text-3xl font-bold text-green-600">{consistencyScore}%</p>
                            </div>

                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h2 className="text-lg font-medium text-gray-900">Next Level</h2>
                                <p className="text-3xl font-bold text-purple-600">{xpInfo.next_level}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="mb-4 text-xl font-semibold">Training Blocks</h2>

                            {editing && (
                                <div className="mb-6 rounded-lg border bg-blue-50 p-4">
                                    <h3 className="mb-2 font-medium text-blue-700">Set Block Start Date</h3>
                                    <div className="flex items-center">
                                        <div className="mr-4 flex items-center">
                                            <label htmlFor="blockSelect" className="mr-2 text-gray-700">
                                                Choose Block:
                                            </label>
                                            <select
                                                id="blockSelect"
                                                className="rounded border px-2 py-1"
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
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="mr-4 rounded border px-3 py-2"
                                        />
                                        <button
                                            onClick={() => updateAllBlockDates(startDate, selectedBlockNumber)}
                                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                            disabled={!startDate}
                                        >
                                            Apply to Block {selectedBlockNumber} & Following
                                        </button>
                                    </div>
                                    <p className="mt-2 text-sm text-blue-600">
                                        This will update Block {selectedBlockNumber} and all following blocks automatically, with each block starting
                                        after the previous one ends.
                                    </p>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Block</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Start Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                End Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Duration
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {editedBlocks.map((block) => (
                                            <tr key={block.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                                                        <span className="font-medium text-gray-900">Block {block.block_number}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-gray-600">{formatDate(block.start_date)}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-gray-600">{formatDate(block.end_date)}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-gray-600">{block.duration_weeks} weeks</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {editing && (
                                <div className="mt-4 text-sm text-gray-500">
                                    <p>⚠️ Changing block dates will automatically adjust the release dates of all sessions within each block.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAthleteDashboard;
