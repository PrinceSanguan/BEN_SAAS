import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface SessionData {
    session_number?: string | number;
    week_number?: string | number;
    block_number?: string | number;
    id?: string | number;
}

interface TrainingSessionProps {
    session?: SessionData;
    existingResult: any | null;
}

const TrainingSession: React.FC<TrainingSessionProps> = ({ session = {}, existingResult = null }) => {
    // Try to get session ID from URL if it's not in props
    const url = window.location.pathname;
    const urlSessionId = url.split('/').pop();

    console.log('Session from props:', session);
    console.log('Session ID from URL:', urlSessionId);

    // Add defaults in case session is undefined
    const sessionData: SessionData = session || {};
    const sessionNumber = sessionData.session_number || 'Unknown';
    const weekNumber = sessionData.week_number || 'Unknown';
    const blockNumber = sessionData.block_number || 'Unknown';

    // Try to get sessionId from multiple sources
    let sessionId = '';
    if (sessionData.id) {
        sessionId = sessionData.id.toString();
    } else if (urlSessionId) {
        sessionId = urlSessionId;
    }

    console.log('Final sessionId to be used:', sessionId);

    const { data, setData, post, processing, errors } = useForm({
        warmup_completed: existingResult ? existingResult.warmup_completed : 'NO',
        plyometrics_score: existingResult ? existingResult.plyometrics_score : '',
        power_score: existingResult ? existingResult.power_score : '',
        lower_body_strength_score: existingResult ? existingResult.lower_body_strength_score : '',
        upper_body_core_strength_score: existingResult ? existingResult.upper_body_core_strength_score : '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // For debugging
        console.log('Form submitted', data);
        console.log('Using sessionId:', sessionId);

        if (sessionId) {
            post(`/training/session/${sessionId}/save`, {
                onSuccess: () => {
                    console.log('Form submitted successfully');
                },
                onError: (errors) => {
                    console.error('Form submission errors:', errors);
                },
            });
        } else {
            console.error('No session ID available');

            // Fallback approach - try to submit anyway using the URL path
            if (urlSessionId) {
                console.log('Trying fallback with URL session ID');
                post(`/training/session/${urlSessionId}/save`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            <Head title={`Training Session ${sessionNumber}`} />

            <header className="sticky top-0 z-10 bg-[#0a1e3c]/80 backdrop-blur-md border-b border-[#1e3a5f] px-4 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Session {sessionNumber}</h1>
                        <p className="text-[#a3c0e6]">
                            Block {blockNumber} - Week {weekNumber}
                        </p>
                    </div>

                    {existingResult && (
                        <div className="rounded-full bg-[#1e3a5f] px-3 py-1 text-sm font-medium text-[#4a90e2]">
                            Completed
                        </div>
                    )}
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6 pb-24">
                <div className="overflow-hidden rounded-xl bg-[#112845] shadow-lg border border-[#1e3a5f]">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#4a90e2] uppercase tracking-wider">
                                Did you complete the warm up?
                            </label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setData('warmup_completed', 'YES')}
                                    className={`rounded-lg px-4 py-2 transition-colors ${
                                        data.warmup_completed === 'YES'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-[#1e3a5f] text-[#a3c0e6] hover:bg-[#2a4a70]'
                                    }`}
                                >
                                    YES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('warmup_completed', 'NO')}
                                    className={`rounded-lg px-4 py-2 transition-colors ${
                                        data.warmup_completed === 'NO'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-[#1e3a5f] text-[#a3c0e6] hover:bg-[#2a4a70]'
                                    }`}
                                >
                                    NO
                                </button>
                            </div>
                            {errors.warmup_completed && <p className="mt-1 text-sm text-red-400">{errors.warmup_completed}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#4a90e2] uppercase tracking-wider">
                                PLYOMETRICS – What was your best score?
                            </label>
                            <input
                                type="text"
                                value={data.plyometrics_score}
                                onChange={(e) => setData('plyometrics_score', e.target.value)}
                                className="mt-1 block w-full rounded-md bg-[#0a1e3c] border-[#1e3a5f] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2] focus:ring-opacity-50"
                                placeholder="Enter your score"
                            />
                            {errors.plyometrics_score && <p className="mt-1 text-sm text-red-400">{errors.plyometrics_score}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#4a90e2] uppercase tracking-wider">
                                POWER – What was your best score/level?
                            </label>
                            <input
                                type="text"
                                value={data.power_score}
                                onChange={(e) => setData('power_score', e.target.value)}
                                className="mt-1 block w-full rounded-md bg-[#0a1e3c] border-[#1e3a5f] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2] focus:ring-opacity-50"
                                placeholder="Enter your score/level"
                            />
                            {errors.power_score && <p className="mt-1 text-sm text-red-400">{errors.power_score}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#4a90e2] uppercase tracking-wider">
                                LOWER BODY STRENGTH – What was your best score?
                            </label>
                            <input
                                type="text"
                                value={data.lower_body_strength_score}
                                onChange={(e) => setData('lower_body_strength_score', e.target.value)}
                                className="mt-1 block w-full rounded-md bg-[#0a1e3c] border-[#1e3a5f] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2] focus:ring-opacity-50"
                                placeholder="Enter your score"
                            />
                            {errors.lower_body_strength_score && <p className="mt-1 text-sm text-red-400">{errors.lower_body_strength_score}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#4a90e2] uppercase tracking-wider">
                                UPPER BODY/CORE STRENGTH – What was your best score?
                            </label>
                            <input
                                type="text"
                                value={data.upper_body_core_strength_score}
                                onChange={(e) => setData('upper_body_core_strength_score', e.target.value)}
                                className="mt-1 block w-full rounded-md bg-[#0a1e3c] border-[#1e3a5f] text-white shadow-sm focus:border-[#4a90e2] focus:ring focus:ring-[#4a90e2] focus:ring-opacity-50"
                                placeholder="Enter your score"
                            />
                            {errors.upper_body_core_strength_score && (
                                <p className="mt-1 text-sm text-red-400">{errors.upper_body_core_strength_score}</p>
                            )}
                        </div>

                        <div className="flex justify-between pt-4">
                            <a
                                href={route('student.training')}
                                className="inline-flex items-center rounded-lg border border-[#1e3a5f] bg-transparent px-4 py-2 text-sm font-medium text-[#a3c0e6] shadow-sm hover:bg-[#1e3a5f] transition-colors"
                            >
                                Back to Training
                            </a>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-lg bg-[#4a90e2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3a80d2] transition-colors focus:outline-none disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : existingResult ? 'Update Results' : 'Save Results'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bottom Navigation - Styled to match the blue theme */}
            <div className="fixed right-0 bottom-0 left-0 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 backdrop-blur-md shadow-lg z-20">
                <div className="flex justify-around">
                    <a href={route('student.training')} className="flex flex-col items-center py-3 px-4 text-[#4a90e2] border-t-2 border-[#4a90e2]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs">Training</span>
                    </a>
                    <a href={route('student.dashboard')} className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-xs">Home</span>
                    </a>
                    <a href="/progress" className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-xs">Progress</span>
                    </a>
                    <a href="/settings" className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs">Settings</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TrainingSession;
