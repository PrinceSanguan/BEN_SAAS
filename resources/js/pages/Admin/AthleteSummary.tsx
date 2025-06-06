import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Athlete = {
    id: number;
    username: string;
    email: string;
    created_at: string;
    strength_level?: number;
    consistency_score?: number;
    training_results?: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        single_leg_wall_sit_left: number | null;
        single_leg_wall_sit_right: number | null;
        core_endurance_left: number | null;
        core_endurance_right: number | null;
        bent_arm_hang: number | null;
    };
};

type Props = {
    athlete: Athlete;
    progressData?: { [key: string]: any };
    xpInfo?: {
        total_xp: number;
        current_level: number;
        next_level: number;
    };
};

export default function AthleteSummary({ athlete, progressData, xpInfo }: Props) {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const generatePDF = () => {
        setIsGeneratingPDF(true);

        // Ensure charts are fully rendered before printing
        setTimeout(() => {
            window.print();
            setIsGeneratingPDF(false);
        }, 500);
    };

    const progressDataArray = progressData ? Object.entries(progressData) : [];
    const totalCharts = progressDataArray.length;

    return (
        <div className="min-h-screen bg-white">
            <Head title={`${athlete.username} - Performance Summary`} />

            {/* Header Actions - Not included in PDF */}
            <div className="border-b bg-gray-50 p-4 print:hidden">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Performance Summary</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={generatePDF}
                            disabled={isGeneratingPDF}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isGeneratingPDF ? 'Generating PDF...' : 'Download as PDF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Content - A4 Landscape Layout */}
            <div id="summary-content" className="mx-auto bg-white print:!mx-0 print:!w-full">
                {/* Page 1: Header and Overview */}
                <div className="page-content print:min-h-[700px]" style={{ padding: '15mm' }}>
                    {/* Header */}
                    <div className="mb-6 border-b-2 border-gray-300 pb-4 text-center">
                        <h1 className="mb-2 text-4xl font-bold text-gray-900">{athlete.username}</h1>
                        <p className="text-lg font-medium text-gray-600">Performance Summary Report</p>
                        <div className="mt-3 flex items-center justify-center gap-4 text-gray-500">
                            <p className="text-sm">
                                Generated:{' '}
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <span className="text-gray-400">•</span>
                            <p className="text-sm">Email: {athlete.email}</p>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="mb-6 grid grid-cols-4 gap-4">
                        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-center">
                            <h3 className="mb-2 text-xs font-bold tracking-wide text-blue-600 uppercase">Strength Level</h3>
                            <div className="mb-1 text-3xl font-bold text-blue-900">{athlete.strength_level || 1}</div>
                            {xpInfo && (
                                <>
                                    <p className="text-xs font-medium text-blue-600">{xpInfo.total_xp} XP Total</p>
                                    <div className="mt-2 h-2 w-full rounded-full bg-blue-200">
                                        <div
                                            className="h-2 rounded-full bg-blue-600"
                                            style={{ width: `${Math.min((xpInfo.total_xp / (xpInfo.next_level * 5)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-center">
                            <h3 className="mb-2 text-xs font-bold tracking-wide text-green-600 uppercase">Consistency</h3>
                            <div className="mb-1 text-3xl font-bold text-green-900">{athlete.consistency_score || 0}%</div>
                            <p className="text-xs font-medium text-green-600">Training Adherence</p>
                            <div className="mt-2 h-2 w-full rounded-full bg-green-200">
                                <div className="h-2 rounded-full bg-green-600" style={{ width: `${athlete.consistency_score || 0}%` }}></div>
                            </div>
                        </div>

                        <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 text-center">
                            <h3 className="mb-2 text-xs font-bold tracking-wide text-purple-600 uppercase">Total Tests</h3>
                            <div className="mb-1 text-3xl font-bold text-purple-900">{totalCharts}</div>
                            <p className="text-xs font-medium text-purple-600">Completed</p>
                        </div>

                        <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 text-center">
                            <h3 className="mb-2 text-xs font-bold tracking-wide text-orange-600 uppercase">Member Since</h3>
                            <div className="mb-1 text-base font-bold text-orange-900">
                                {new Date(athlete.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </div>
                            <p className="text-xs font-medium text-orange-600">Join Date</p>
                        </div>
                    </div>

                    {/* Training Results */}
                    {athlete.training_results && (
                        <div className="mb-6">
                            <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">Pre-Training Baseline Results</h2>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Standing Long Jump</p>
                                    <p className="text-lg font-bold text-gray-900">{athlete.training_results.standing_long_jump || '-'}</p>
                                    <p className="text-xs font-medium text-gray-600">cm</p>
                                </div>
                                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Single Leg Jump (L)</p>
                                    <p className="text-lg font-bold text-gray-900">{athlete.training_results.single_leg_jump_left || '-'}</p>
                                    <p className="text-xs font-medium text-gray-600">cm</p>
                                </div>
                                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Single Leg Jump (R)</p>
                                    <p className="text-lg font-bold text-gray-900">{athlete.training_results.single_leg_jump_right || '-'}</p>
                                    <p className="text-xs font-medium text-gray-600">cm</p>
                                </div>
                                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Wall Sit (L)</p>
                                    <p className="text-lg font-bold text-gray-900">{athlete.training_results.single_leg_wall_sit_left || '-'}</p>
                                    <p className="text-xs font-medium text-gray-600">sec</p>
                                </div>
                                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Wall Sit (R)</p>
                                    <p className="text-lg font-bold text-gray-900">{athlete.training_results.single_leg_wall_sit_right || '-'}</p>
                                    <p className="text-xs font-medium text-gray-600">sec</p>
                                </div>
                                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Core Endurance (L)</p>
                                    <p className="text-lg font-bold text-gray-900">{athlete.training_results.core_endurance_left || '-'}</p>
                                    <p className="text-xs font-medium text-gray-600">sec</p>
                                </div>
                                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Core Endurance (R)</p>
                                    <p className="text-lg font-bold text-gray-900">{athlete.training_results.core_endurance_right || '-'}</p>
                                    <p className="text-xs font-medium text-gray-600">sec</p>
                                </div>
                                <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
                                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">Bent Arm Hang</p>
                                    <p className="text-lg font-bold text-gray-900">{athlete.training_results.bent_arm_hang || '-'}</p>
                                    <p className="text-xs font-medium text-gray-600">sec</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* All Progress Charts on One Page */}
                    {progressDataArray.length > 0 && (
                        <>
                            {Array.from({ length: Math.ceil(progressDataArray.length / 4) }, (_, pageIndex) => (
                                <div key={pageIndex} className={pageIndex > 0 ? 'print:break-before-page' : ''}>
                                    {pageIndex === 0 && (
                                        <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
                                            Progress Charts & Performance Analysis
                                        </h2>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        {progressDataArray.slice(pageIndex * 4, (pageIndex + 1) * 4).map(([testKey, data]) => (
                                            <div key={testKey} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-base font-bold text-gray-900">{data.name}</h3>
                                                        <p className="text-xs text-gray-600">
                                                            {data.sessions ? data.sessions.length : 0} points
                                                            {data.sessions && data.sessions.length > 0
                                                                ? ` • Latest: ${data.sessions[data.sessions.length - 1].value}`
                                                                : ' • No data'}
                                                        </p>
                                                    </div>
                                                    {data.percentageIncrease !== null && (
                                                        <div className="text-right">
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                                                                    data.percentageIncrease > 0
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : data.percentageIncrease < 0
                                                                          ? 'bg-red-100 text-red-800'
                                                                          : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                            >
                                                                {data.percentageIncrease > 0 ? '↗' : data.percentageIncrease < 0 ? '↘' : '→'}
                                                                {data.percentageIncrease > 0 ? '+' : ''}
                                                                {data.percentageIncrease}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {data.sessions && data.sessions.length > 0 ? (
                                                    <div className="h-32 print:h-24">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={data.sessions} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                                <XAxis
                                                                    dataKey="date"
                                                                    tick={{ fontSize: 10, fill: '#4b5563' }}
                                                                    tickFormatter={(date) => {
                                                                        const d = new Date(date);
                                                                        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                                    }}
                                                                />
                                                                <YAxis
                                                                    tick={{ fontSize: 10, fill: '#4b5563' }}
                                                                    domain={['dataMin - 5', 'dataMax + 5']}
                                                                />
                                                                <Tooltip
                                                                    contentStyle={{
                                                                        backgroundColor: '#ffffff',
                                                                        border: '1px solid #e5e7eb',
                                                                        borderRadius: '8px',
                                                                        fontSize: '12px',
                                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                                    }}
                                                                    labelFormatter={(date) => {
                                                                        const d = new Date(date);
                                                                        return d.toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                        });
                                                                    }}
                                                                    formatter={(value, name) => [`${value}`, data.name]}
                                                                />
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey="value"
                                                                    stroke="#2563eb"
                                                                    strokeWidth={2}
                                                                    dot={{ r: 3, fill: '#2563eb', strokeWidth: 1, stroke: '#ffffff' }}
                                                                    activeDot={{ r: 4, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 1 }}
                                                                />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 print:h-24">
                                                        <div className="text-center">
                                                            <svg
                                                                className="mx-auto h-8 w-8 text-gray-400"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={1}
                                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                                />
                                                            </svg>
                                                            <p className="mt-1 text-xs text-gray-500">No data</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Footer */}
                    <div className="mt-6 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
                        <p>This report was generated automatically from {athlete.username}'s training data.</p>
                        <p className="mt-1">For questions about this report, please contact your training administrator.</p>
                    </div>
                </div>
            </div>

            {/* Enhanced Print Styles */}
            <style>{`
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        font-family: 'Arial', sans-serif !important;
                    }
                    
                    body * {
                        visibility: hidden;
                    }
                    
                    #summary-content,
                    #summary-content * {
                        visibility: visible;
                    }
                    
                    #summary-content {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    
                    .page-content {
                        width: 100% !important;
                        box-sizing: border-box !important;
                        background: white !important;
                    }
                    
                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }
                    
                    .print\\:min-h-\\[700px\\] {
                        min-height: 700px !important;
                    }
                    
                    .print\\:h-24 {
                        height: 6rem !important;
                    }
                    
                    .print\\:hidden {
                        display: none !important;
                    }
                    
                    .print\\:\\!mx-0 {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                    }
                    
                    .print\\:\\!w-full {
                        width: 100% !important;
                    }
                    
                    /* Ensure charts print correctly */
                    .recharts-wrapper {
                        background: white !important;
                    }
                    
                    svg {
                        background: white !important;
                    }
                    
                    /* Force colors to print */
                    .bg-blue-50,
                    .bg-green-50,
                    .bg-purple-50,
                    .bg-orange-50,
                    .bg-gray-50 {
                        background-color: #f8fafc !important;
                        border: 1px solid #e2e8f0 !important;
                    }
                    
                    .border-blue-200 { border-color: #bfdbfe !important; }
                    .border-green-200 { border-color: #bbf7d0 !important; }
                    .border-purple-200 { border-color: #e9d5ff !important; }
                    .border-orange-200 { border-color: #fed7aa !important; }
                    .border-gray-200,
                    .border-gray-300 { border-color: #e5e7eb !important; }
                    
                    .text-blue-600,
                    .text-blue-900 { color: #1d4ed8 !important; }
                    .text-green-600,
                    .text-green-900 { color: #059669 !important; }
                    .text-purple-600,
                    .text-purple-900 { color: #7c3aed !important; }
                    .text-orange-600,
                    .text-orange-900 { color: #ea580c !important; }
                    .text-gray-500,
                    .text-gray-600,
                    .text-gray-900 { color: #374151 !important; }
                    
                    .bg-green-100 { background-color: #dcfce7 !important; }
                    .bg-red-100 { background-color: #fee2e2 !important; }
                    .bg-gray-100 { background-color: #f3f4f6 !important; }
                    .text-green-800 { color: #166534 !important; }
                    .text-red-800 { color: #991b1b !important; }
                    .text-gray-800 { color: #1f2937 !important; }
                }
            `}</style>
        </div>
    );
}
