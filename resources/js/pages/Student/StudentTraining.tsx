import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

interface Session {
    id: number;
    session_number: number | null;
    session_type: 'training' | 'testing' | 'rest';
    is_completed: boolean;
    label: string;
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

interface StudentTrainingProps {
    blocks: Block[];
}

const StudentTraining: React.FC<StudentTrainingProps> = ({ blocks }) => {
    const [expandedBlock, setExpandedBlock] = useState<number | null>(null);

    const toggleBlock = (blockId: number) => {
        if (expandedBlock === blockId) {
            setExpandedBlock(null);
        } else {
            setExpandedBlock(blockId);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a] pb-24">
            <Head title="Your Training" />

            <header className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-4 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                            <svg
                                className="h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white">Your Training</h1>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6">
                {blocks.length === 0 ? (
                    <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 text-center shadow-lg">
                        <p className="text-[#a3c0e6]">No training blocks available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blocks.map((block) => (
                            <div key={block.id} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                                <button
                                    onClick={() => toggleBlock(block.id)}
                                    className="w-full border-b border-[#1e3a5f] px-4 py-5 text-left font-medium text-white transition-colors hover:bg-[#1a3456] focus:outline-none"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a5f]">
                                                <svg
                                                    className="h-4 w-4 text-[#4a90e2]"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                            </div>
                                            <span>Block {block.block_number}</span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 text-[#4a90e2] transition-transform duration-200 ${expandedBlock === block.id ? 'rotate-180 transform' : ''}`}
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

                                {expandedBlock === block.id && (
                                    <div className="divide-y divide-[#1e3a5f] px-4 py-4">
                                        {block.weeks.map((week) => (
                                            <div key={week.week_number} className="py-4">
                                                <h3 className="mb-3 text-lg font-medium text-white">Week {week.week_number}</h3>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    {week.sessions.map((session) => (
                                                        <div
                                                            key={session.id}
                                                            className={`rounded-lg p-4 ${
                                                                session.session_type === 'testing'
                                                                    ? 'border border-[#b59e00] bg-[#332b00]'
                                                                    : session.session_type === 'rest'
                                                                      ? 'border border-[#1e3a5f] bg-[#1e3a5f]/40'
                                                                      : session.is_completed
                                                                        ? 'border border-[#34d27b] bg-[#0a2e1a]'
                                                                        : 'border border-[#4a90e2] bg-[#0a1e3c]'
                                                            }`}
                                                        >
                                                            {session.session_type !== 'rest' ? (
                                                                <a
                                                                    href={route('training.session.show', { sessionId: session.id })}
                                                                    className="block w-full text-white transition-colors hover:text-[#63b3ed]"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span>{session.label}</span>
                                                                        {session.is_completed && (
                                                                            <span className="ml-2 inline-flex items-center rounded-full bg-[#34d27b]/20 px-2 py-1 text-xs font-medium text-[#34d27b]">
                                                                                Completed
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </a>
                                                            ) : (
                                                                <span className="block w-full cursor-default text-[#a3c0e6]">{session.label}</span>
                                                            )}
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

            {/* Bottom Navigation - Styled for Blue Theme */}
            <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 shadow-lg backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl justify-around">
                    <a href={route('student.training')} className="flex flex-col items-center border-t-2 border-[#4a90e2] px-4 py-3 text-[#4a90e2]">
                        <svg
                            className="mb-1 h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                        <span className="text-xs">Training</span>
                    </a>
                    <a
                        href={route('student.dashboard')}
                        className="flex flex-col items-center px-4 py-3 text-[#a3c0e6] transition-colors hover:text-white"
                    >
                        <svg
                            className="mb-1 h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs">Home</span>
                    </a>
                    {/*   <a
                        href="/progress"
                        className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
                    >
                        <svg className="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                        <span className="text-xs">Progress</span>
                    </a> */}
                    {/* <a href="/settings" className="flex flex-col items-center px-4 py-3 text-[#a3c0e6] transition-colors hover:text-white">
                        <svg
                            className="mb-1 h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span className="text-xs">Settings</span>
                    </a> */}
                </div>
            </div>
        </div>
    );
};

export default StudentTraining;
