import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Session {
    id: number;
    label: string;
    session_type: string;
    is_completed: boolean;
}

interface Week {
    week_number: number;
    sessions: Session[];
}

interface Block {
    id: number;
    block_number: number;
    weeks: Week[];
}

const StudentTraining = ({ blocks }: { blocks: Block[] }) => {
    const [activeBlock, setActiveBlock] = useState<number | null>(null);

    const toggleBlock = (blockId: number) => {
        setActiveBlock(activeBlock === blockId ? null : blockId);
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-16">
            <Head title="Your Training" />

            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Your Training</h1>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6">
                {blocks.length === 0 ? (
                    <div className="overflow-hidden rounded-lg bg-white p-6 text-center shadow-sm">
                        <p className="text-gray-500">No training blocks available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blocks.map((block) => (
                            <div key={block.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                                <button
                                    onClick={() => toggleBlock(block.id)}
                                    className="w-full border-b border-gray-200 px-4 py-5 text-left font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Block {block.block_number}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 transition-transform duration-200 ${activeBlock === block.id ? 'rotate-180 transform' : ''}`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>

                                {activeBlock === block.id && (
                                    <div className="divide-y divide-gray-200 px-4 py-4">
                                        {block.weeks.map((week) => (
                                            <div key={week.week_number} className="py-3">
                                                <h3 className="mb-2 text-lg font-medium text-gray-900">Week {week.week_number}</h3>
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    {week.sessions.map((session) => (
                                                        <div
                                                            key={session.id}
                                                            className={`rounded-md px-4 py-3 ${
                                                                session.session_type === 'testing'
                                                                    ? 'border border-yellow-400 bg-yellow-100'
                                                                    : session.session_type === 'rest'
                                                                      ? 'border border-gray-300 bg-gray-100'
                                                                      : session.is_completed
                                                                        ? 'border border-green-300 bg-green-50'
                                                                        : 'border border-blue-300 bg-blue-50'
                                                            }`}
                                                        >
                                                            <a
                                                                href={session.session_type !== 'rest' ? `/training/session/${session.id}` : '#'}
                                                                className={`block w-full ${session.session_type === 'rest' ? 'cursor-default' : ''}`}
                                                            >
                                                                {session.label}
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Simple Bottom Navigation */}
            <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white shadow-lg">
                <div className="flex justify-around">
                    <a href="/training" className="border-t-2 border-blue-600 py-3 font-medium text-blue-600">
                        Training
                    </a>
                    <a href="/dashboard" className="py-3 text-gray-600 hover:text-gray-900">
                        Home
                    </a>
                    <a href="/progress" className="py-3 text-gray-600 hover:text-gray-900">
                        Progress
                    </a>
                    <a href="/settings" className="py-3 text-gray-600 hover:text-gray-900">
                        Settings
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StudentTraining;
