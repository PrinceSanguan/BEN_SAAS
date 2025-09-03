import Sidebar from '@/components/Student/Sidebar';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

interface SessionData {
    session_number?: string | number;
    week_number?: string | number;
    block_number?: string | number;
    id?: string | number;
    session_type?: string;
}

interface TrainingSessionProps {
    session?: SessionData;
    existingResult: any | null;
    username?: string;
    routes?: {
        [key: string]: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const TrainingSession: React.FC<TrainingSessionProps> = ({ session = {}, existingResult = null, username = 'Athlete', routes = {}, flash }) => {
    // Get session data
    const sessionData: SessionData = session || {};
    const sessionNumber = sessionData.session_number || 'Unknown';
    const weekNumber = sessionData.week_number || 'Unknown';
    const blockNumber = sessionData.block_number || 'Unknown';
    const isTesting = sessionData.session_type === 'testing';

    // Get session ID from props or URL
    const urlSessionId = window.location.pathname.split('/').pop();
    const sessionId = sessionData.id?.toString() || urlSessionId || '';

    // Success modal state
    const [showSuccess, setShowSuccess] = useState(!!flash?.success);

    // Form setup
    const { data, setData, post, processing, errors } = useForm(
        isTesting
            ? {
                  standing_long_jump: existingResult?.standing_long_jump || '',
                  single_leg_jump_left: existingResult?.single_leg_jump_left || '',
                  single_leg_jump_right: existingResult?.single_leg_jump_right || '',
                  single_leg_wall_sit_left: existingResult?.single_leg_wall_sit_left || '',
                  single_leg_wall_sit_right: existingResult?.single_leg_wall_sit_right || '',
                  core_endurance_left: existingResult?.core_endurance_left || '',
                  core_endurance_right: existingResult?.core_endurance_right || '',
                  bent_arm_hang_assessment: existingResult?.bent_arm_hang_assessment || '',
              }
            : {
                  warmup_completed: existingResult?.warmup_completed || 'NO',
                  plyometrics_score: existingResult?.plyometrics_score || '',
                  power_score: existingResult?.power_score || '',
                  lower_body_strength_score: existingResult?.lower_body_strength_score || '',
                  upper_body_core_strength_score: existingResult?.upper_body_core_strength_score || '',
              },
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (sessionId) {
            post(`/training/session/${sessionId}/save`, {
                onSuccess: () => {
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 1000);
                },
                onError: (errors) => {
                    console.error('Form submission errors:', errors);
                },
            });
        }
    };

    const handleNumberInput = (field: string, value: string) => {
        if (value === '' || !isNaN(parseFloat(value))) {
            setData(field as any, value);
        }
    };

    const getRoute = (name: string) => {
        return (
            routes[name] ||
            {
                'student.dashboard': '/student/dashboard',
                'student.training': '/student/training',
            }[name] ||
            '#'
        );
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            <Head title={`Training Session ${sessionNumber}`} />

            {/* Sidebar */}
            <div className="hidden lg:block">
                <Sidebar username={username} routes={routes} currentRoute={window.location.pathname} />
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-4 py-4 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl">
                        <h1 className="text-2xl font-bold text-white">Session {sessionNumber}</h1>
                        <p className="text-[#a3c0e6]">
                            Block {blockNumber} - Week {weekNumber}
                        </p>
                        {existingResult && (
                            <div className="mt-2 inline-block rounded-full bg-[#1e3a5f] px-3 py-1 text-sm text-[#4a90e2]">Completed</div>
                        )}
                    </div>
                </header>

                {/* Form */}
                <main className="mx-auto max-w-4xl px-4 py-6 pb-32 lg:pb-6">
                    <div className="rounded-xl border border-[#1e3a5f] bg-[#112845] p-4 lg:p-6">
                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                            {isTesting ? (
                                <>
                                    {/* Instructions */}
                                    <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-900/30 p-4">
                                        <h3 className="mb-2 font-semibold text-blue-400">Important Instructions:</h3>
                                        <ul className="space-y-1 text-sm text-gray-300">
                                            <li>• Enter all measurements as numbers only</li>
                                            <li>• Distance measurements: Use centimeters (e.g., 135)</li>
                                            <li>• Time measurements: Use seconds (e.g., 96 instead of 1m36s)</li>
                                            <li>• If you couldn't complete a test, leave it blank</li>
                                        </ul>
                                    </div>

                                    {/* Testing Fields */}
                                    <div className="grid gap-4 lg:gap-6">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Standing Long Jump - What was your best score? (cm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={data.standing_long_jump}
                                                onChange={(e) => handleNumberInput('standing_long_jump', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter distance in centimeters (e.g., 125)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter numeric values only</p>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Single Leg Jump (Left) - What was your best score? (cm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={data.single_leg_jump_left}
                                                onChange={(e) => handleNumberInput('single_leg_jump_left', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter distance in centimeters (e.g., 85)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter numeric values only</p>
                                            {errors.single_leg_jump_left && (
                                                <p className="mt-1 text-sm text-red-400">{errors.single_leg_jump_left}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Single Leg Jump (Right) - What was your best score? (cm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={data.single_leg_jump_right}
                                                onChange={(e) => handleNumberInput('single_leg_jump_right', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter distance in centimeters (e.g., 87)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter numeric values only</p>
                                            {errors.single_leg_jump_right && (
                                                <p className="mt-1 text-sm text-red-400">{errors.single_leg_jump_right}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Single Leg Wall Sit (Left) - What was your best score? (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.single_leg_wall_sit_left}
                                                onChange={(e) => handleNumberInput('single_leg_wall_sit_left', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter time in seconds (e.g., 45)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter time as total seconds</p>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Single Leg Wall Sit (Right) - What was your best score? (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.single_leg_wall_sit_right}
                                                onChange={(e) => handleNumberInput('single_leg_wall_sit_right', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter time in seconds (e.g., 47)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter time as total seconds</p>
                                            {errors.single_leg_wall_sit_right && (
                                                <p className="mt-1 text-sm text-red-400">{errors.single_leg_wall_sit_right}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Core Endurance (Left) - What was your best score? (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.core_endurance_left}
                                                onChange={(e) => handleNumberInput('core_endurance_left', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter time in seconds (e.g., 63)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter time as total seconds</p>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Core Endurance (Right) - What was your best score? (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.core_endurance_right}
                                                onChange={(e) => handleNumberInput('core_endurance_right', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter time in seconds (e.g., 54)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter time as total seconds</p>
                                            {errors.core_endurance_right && (
                                                <p className="mt-1 text-sm text-red-400">{errors.core_endurance_right}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Bent Arm Hang Assessment - What was your best score? (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.bent_arm_hang_assessment}
                                                onChange={(e) => handleNumberInput('bent_arm_hang_assessment', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter time in seconds or leave blank"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Leave blank if unable to complete</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Training Fields */}
                                    <div className="grid gap-4 lg:gap-6">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Did you complete the warm up?
                                            </label>
                                            <div className="flex space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('warmup_completed', 'YES')}
                                                    className={`rounded-lg px-4 py-3 text-sm transition-colors lg:text-base ${
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
                                                    className={`rounded-lg px-4 py-3 text-sm transition-colors lg:text-base ${
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
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Plyometrics - What was your best score?
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.plyometrics_score || ''}
                                                onChange={(e) => handleNumberInput('plyometrics_score', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter your score (e.g., 66)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter numeric values only</p>
                                            {errors.plyometrics_score && <p className="mt-1 text-sm text-red-400">{errors.plyometrics_score}</p>}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Power - What was your best score/level?
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.power_score || ''}
                                                onChange={(e) => handleNumberInput('power_score', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter your score/level (e.g., 56)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter numeric values only</p>
                                            {errors.power_score && <p className="mt-1 text-sm text-red-400">{errors.power_score}</p>}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Lower Body Strength - What was your best score?
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.lower_body_strength_score || ''}
                                                onChange={(e) => handleNumberInput('lower_body_strength_score', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter your score (e.g., 5)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter numeric values only</p>
                                            {errors.lower_body_strength_score && (
                                                <p className="mt-1 text-sm text-red-400">{errors.lower_body_strength_score}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium tracking-wider text-[#4a90e2] uppercase">
                                                Upper Body/Core Strength - What was your best score?
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={data.upper_body_core_strength_score || ''}
                                                onChange={(e) => handleNumberInput('upper_body_core_strength_score', e.target.value)}
                                                className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-3 text-base text-white focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] lg:text-sm"
                                                placeholder="Enter your score (e.g., 65)"
                                            />
                                            <p className="mt-1 text-xs text-gray-400">Enter numeric values only</p>
                                            {errors.upper_body_core_strength_score && (
                                                <p className="mt-1 text-sm text-red-400">{errors.upper_body_core_strength_score}</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Form Actions */}
                            <div className="flex justify-between pt-6">
                                <a
                                    href={getRoute('student.training')}
                                    className="inline-flex items-center rounded-lg border border-[#1e3a5f] bg-transparent px-4 py-2 text-sm font-medium text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Training
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center rounded-lg bg-[#4a90e2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a80d2] disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : existingResult ? 'Update Results' : 'Save Results'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={() => setShowSuccess(false)}>
                    <div className="mx-4 w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-4 text-6xl text-green-500">✓</div>
                        <h2 className="mb-3 text-xl font-bold text-green-600">Success!</h2>
                        <p className="mb-6 text-gray-600">
                            {flash?.success || (existingResult ? 'Results updated successfully!' : 'Results saved successfully!')}
                        </p>
                    </div>
                </div>
            )}

            {/* Mobile Navigation */}
            <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 backdrop-blur-md lg:hidden">
                <div className="flex justify-around">
                    <a
                        href={getRoute('student.training')}
                        className="flex flex-col items-center border-t-2 border-[#4a90e2] px-4 py-3 text-[#4a90e2]"
                    >
                        <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs">Training</span>
                    </a>
                    <a
                        href={getRoute('student.dashboard')}
                        className="flex flex-col items-center px-4 py-3 text-[#a3c0e6] transition-colors hover:text-white"
                    >
                        <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        <span className="text-xs">Home</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TrainingSession;
