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
        <div className="min-h-screen bg-gray-100">
            <Head title={`Training Session ${sessionNumber}`} />

            <header className="bg-white shadow">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Session {sessionNumber}</h1>
                        <p className="text-gray-600">
                            Block {blockNumber} - Week {weekNumber}
                        </p>
                    </div>

                    {existingResult && <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">Completed</div>}
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Did you complete the warm up?</label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setData('warmup_completed', 'YES')}
                                    className={`rounded-lg px-4 py-2 transition-colors ${
                                        data.warmup_completed === 'YES' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    YES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('warmup_completed', 'NO')}
                                    className={`rounded-lg px-4 py-2 transition-colors ${
                                        data.warmup_completed === 'NO' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    NO
                                </button>
                            </div>
                            {errors.warmup_completed && <p className="mt-1 text-sm text-red-600">{errors.warmup_completed}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">PLYOMETRICS – What was your best score?</label>
                            <input
                                type="text"
                                value={data.plyometrics_score}
                                onChange={(e) => setData('plyometrics_score', e.target.value)}
                                className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                                placeholder="Enter your score"
                            />
                            {errors.plyometrics_score && <p className="mt-1 text-sm text-red-600">{errors.plyometrics_score}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">POWER – What was your best score/level?</label>
                            <input
                                type="text"
                                value={data.power_score}
                                onChange={(e) => setData('power_score', e.target.value)}
                                className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                                placeholder="Enter your score/level"
                            />
                            {errors.power_score && <p className="mt-1 text-sm text-red-600">{errors.power_score}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">LOWER BODY STRENGTH – What was your best score?</label>
                            <input
                                type="text"
                                value={data.lower_body_strength_score}
                                onChange={(e) => setData('lower_body_strength_score', e.target.value)}
                                className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                                placeholder="Enter your score"
                            />
                            {errors.lower_body_strength_score && <p className="mt-1 text-sm text-red-600">{errors.lower_body_strength_score}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                UPPER BODY/CORE STRENGTH – What was your best score?
                            </label>
                            <input
                                type="text"
                                value={data.upper_body_core_strength_score}
                                onChange={(e) => setData('upper_body_core_strength_score', e.target.value)}
                                className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                                placeholder="Enter your score"
                            />
                            {errors.upper_body_core_strength_score && (
                                <p className="mt-1 text-sm text-red-600">{errors.upper_body_core_strength_score}</p>
                            )}
                        </div>

                        <div className="flex justify-between pt-4">
                            <a
                                href={route('student.training')}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Back to Training
                            </a>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : existingResult ? 'Update Results' : 'Save Results'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Simple Bottom Navigation */}
            <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white shadow-lg">
                <div className="flex justify-around">
                    <a href={route('student.training')} className="border-t-2 border-blue-600 py-3 font-medium text-blue-600">
                        Training
                    </a>
                    <a href={route('student.dashboard')} className="py-3 text-gray-600 hover:text-gray-900">
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

export default TrainingSession;
