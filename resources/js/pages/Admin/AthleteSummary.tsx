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
        setTimeout(() => {
            window.print();
            setIsGeneratingPDF(false);
        }, 500);
    };

    const progressDataArray = progressData ? Object.entries(progressData) : [];

    return (
        <div className="min-h-screen bg-white">
            <Head title={`${athlete.username} - Performance Summary`} />

            {/* Header Actions - Not included in PDF */}
            <div className="border-b bg-gray-50 p-3 print:hidden">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Performance Summary</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={generatePDF}
                            disabled={isGeneratingPDF}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isGeneratingPDF ? 'Generating PDF...' : 'Download as PDF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Content - A4 Landscape Layout */}
            <div id="summary-content" className="mx-auto bg-white print:!mx-0 print:!w-full">
                <div className="page-content" style={{ padding: '5mm', minHeight: '180mm' }}>
                    {/* Compact Header */}
                    <div className="mb-3 border-b border-gray-300 pb-2 text-center">
                        <h1 className="mb-1 text-2xl font-bold text-gray-900">{athlete.username}</h1>
                        <p className="text-sm font-medium text-gray-600">Performance Summary Report</p>
                        <div className="mt-1 flex items-center justify-center gap-3 text-xs text-gray-500">
                            <span>Generated: {new Date().toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Email: {athlete.email}</span>
                        </div>
                    </div>

                    {/* Compact Stats Overview */}
                    <div className="mb-3 grid grid-cols-4 gap-2">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-center">
                            <h3 className="mb-1 text-xs font-bold text-blue-600 uppercase">Strength Level</h3>
                            <div className="mb-1 text-2xl font-bold text-blue-900">{athlete.strength_level || 1}</div>
                            {xpInfo && (
                                <>
                                    <p className="text-xs text-blue-600">{xpInfo.total_xp} XP</p>
                                    <div className="mt-1 h-1 w-full rounded-full bg-blue-200">
                                        <div
                                            className="h-1 rounded-full bg-blue-600"
                                            style={{ width: `${Math.min((xpInfo.total_xp / (xpInfo.next_level * 5)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="rounded-lg border border-green-200 bg-green-50 p-2 text-center">
                            <h3 className="mb-1 text-xs font-bold text-green-600 uppercase">Consistency</h3>
                            <div className="mb-1 text-2xl font-bold text-green-900">{athlete.consistency_score || 0}%</div>
                            <p className="text-xs text-green-600">Training Adherence</p>
                            <div className="mt-1 h-1 w-full rounded-full bg-green-200">
                                <div className="h-1 rounded-full bg-green-600" style={{ width: `${athlete.consistency_score || 0}%` }}></div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-purple-200 bg-purple-50 p-2 text-center">
                            <h3 className="mb-1 text-xs font-bold text-purple-600 uppercase">Total Tests</h3>
                            <div className="mb-1 text-2xl font-bold text-purple-900">{progressDataArray.length}</div>
                            <p className="text-xs text-purple-600">Completed</p>
                        </div>

                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-2 text-center">
                            <h3 className="mb-1 text-xs font-bold text-orange-600 uppercase">Member Since</h3>
                            <div className="mb-1 text-sm font-bold text-orange-900">
                                {new Date(athlete.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                })}
                            </div>
                            <p className="text-xs text-orange-600">Join Date</p>
                        </div>
                    </div>

                    {/* Compact Training Results - Only show 6 most important */}
                    {athlete.training_results && (
                        <div className="mb-3">
                            <h2 className="mb-2 border-b border-gray-200 pb-1 text-sm font-bold text-gray-900">Pre-Training Baseline Results</h2>
                            <div className="grid grid-cols-6 gap-1">
                                <div className="rounded border border-gray-300 bg-gray-50 p-1">
                                    <p className="mb-1 text-xs font-bold text-gray-500">Standing Long Jump</p>
                                    <p className="text-sm font-bold text-gray-900">{athlete.training_results.standing_long_jump || '-'}</p>
                                    <p className="text-xs text-gray-600">cm</p>
                                </div>
                                <div className="rounded border border-gray-300 bg-gray-50 p-1">
                                    <p className="mb-1 text-xs font-bold text-gray-500">SL Jump (L)</p>
                                    <p className="text-sm font-bold text-gray-900">{athlete.training_results.single_leg_jump_left || '-'}</p>
                                    <p className="text-xs text-gray-600">cm</p>
                                </div>
                                <div className="rounded border border-gray-300 bg-gray-50 p-1">
                                    <p className="mb-1 text-xs font-bold text-gray-500">SL Jump (R)</p>
                                    <p className="text-sm font-bold text-gray-900">{athlete.training_results.single_leg_jump_right || '-'}</p>
                                    <p className="text-xs text-gray-600">cm</p>
                                </div>
                                <div className="rounded border border-gray-300 bg-gray-50 p-1">
                                    <p className="mb-1 text-xs font-bold text-gray-500">Wall Sit (L)</p>
                                    <p className="text-sm font-bold text-gray-900">{athlete.training_results.single_leg_wall_sit_left || '-'}</p>
                                    <p className="text-xs text-gray-600">sec</p>
                                </div>
                                <div className="rounded border border-gray-300 bg-gray-50 p-1">
                                    <p className="mb-1 text-xs font-bold text-gray-500">Wall Sit (R)</p>
                                    <p className="text-sm font-bold text-gray-900">{athlete.training_results.single_leg_wall_sit_right || '-'}</p>
                                    <p className="text-xs text-gray-600">sec</p>
                                </div>
                                <div className="rounded border border-gray-300 bg-gray-50 p-1">
                                    <p className="mb-1 text-xs font-bold text-gray-500">Bent Arm Hang</p>
                                    <p className="text-sm font-bold text-gray-900">{athlete.training_results.bent_arm_hang || '-'}</p>
                                    <p className="text-xs text-gray-600">sec</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Compact Progress Charts - All on one page */}
                    {progressDataArray.length > 0 && (
                        <div>
                            <h2 className="mb-2 border-b border-gray-200 pb-1 text-sm font-bold text-gray-900">
                                Progress Charts & Performance Analysis
                            </h2>

                            <div className="grid grid-cols-3 gap-1">
                                {progressDataArray.slice(0, 6).map(([testKey, data]) => (
                                    <div key={testKey} className="rounded border border-gray-200 bg-white p-1 shadow-sm">
                                        <div className="mb-1 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-900">{data.name}</h3>
                                                <p className="text-xs text-gray-600">{data.sessions ? data.sessions.length : 0} points</p>
                                            </div>
                                            {data.percentageIncrease !== null && (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-1 py-0.5 text-xs font-bold ${
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
                                            )}
                                        </div>

                                        {data.sessions && data.sessions.length > 0 ? (
                                            <div className="h-12">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={data.sessions} margin={{ top: 1, right: 2, left: 2, bottom: 1 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis
                                                            dataKey="date"
                                                            tick={{ fontSize: 6, fill: '#4b5563' }}
                                                            tickFormatter={(date) => {
                                                                const d = new Date(date);
                                                                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                            }}
                                                        />
                                                        <YAxis tick={{ fontSize: 6, fill: '#4b5563' }} domain={['dataMin - 5', 'dataMax + 5']} />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: '#ffffff',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '4px',
                                                                fontSize: '8px',
                                                            }}
                                                            formatter={(value, name) => [`${value}`, data.name]}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="value"
                                                            stroke="#2563eb"
                                                            strokeWidth={1}
                                                            dot={{ r: 1.5, fill: '#2563eb' }}
                                                            activeDot={{ r: 2, fill: '#1d4ed8' }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        ) : (
                                            <div className="flex h-12 items-center justify-center rounded bg-gray-50">
                                                <p className="text-xs text-gray-500">No data</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Additional charts if more than 6 */}
                            {progressDataArray.length > 6 && (
                                <div className="mt-1 grid grid-cols-3 gap-1">
                                    {progressDataArray.slice(6).map(([testKey, data]) => (
                                        <div key={testKey} className="rounded border border-gray-200 bg-white p-1 shadow-sm">
                                            <div className="mb-1 flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-900">{data.name}</h3>
                                                    <p className="text-xs text-gray-600">{data.sessions ? data.sessions.length : 0} points</p>
                                                </div>
                                                {data.percentageIncrease !== null && (
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-1 py-0.5 text-xs font-bold ${
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
                                                )}
                                            </div>

                                            {data.sessions && data.sessions.length > 0 ? (
                                                <div className="h-12">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={data.sessions} margin={{ top: 1, right: 2, left: 2, bottom: 1 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                            <XAxis
                                                                dataKey="date"
                                                                tick={{ fontSize: 6, fill: '#4b5563' }}
                                                                tickFormatter={(date) => {
                                                                    const d = new Date(date);
                                                                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                                }}
                                                            />
                                                            <YAxis tick={{ fontSize: 6, fill: '#4b5563' }} domain={['dataMin - 5', 'dataMax + 5']} />
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: '#ffffff',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px',
                                                                    fontSize: '8px',
                                                                }}
                                                                formatter={(value, name) => [`${value}`, data.name]}
                                                            />
                                                            <Line
                                                                type="monotone"
                                                                dataKey="value"
                                                                stroke="#2563eb"
                                                                strokeWidth={1}
                                                                dot={{ r: 1.5, fill: '#2563eb' }}
                                                                activeDot={{ r: 2, fill: '#1d4ed8' }}
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : (
                                                <div className="flex h-12 items-center justify-center rounded bg-gray-50">
                                                    <p className="text-xs text-gray-500">No data</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Compact Footer */}
                    <div className="mt-1 border-t border-gray-200 pt-1 text-center text-xs text-gray-500">
                        <p>This report was generated automatically from {athlete.username}'s training data.</p>
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
                        max-height: 180mm !important;
                        overflow: hidden !important;
                        box-sizing: border-box !important;
                        background: white !important;
                    }
                    
                    @page {
                        size: A4 landscape;
                        margin: 5mm;
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
                    .bg-blue-50 { background-color: #eff6ff !important; }
                    .bg-green-50 { background-color: #f0fdf4 !important; }
                    .bg-purple-50 { background-color: #faf5ff !important; }
                    .bg-orange-50 { background-color: #fff7ed !important; }
                    .bg-gray-50 { background-color: #f9fafb !important; }
                    
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
