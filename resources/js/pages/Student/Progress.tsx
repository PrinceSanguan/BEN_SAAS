import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Layout from '@/components/Student/Layout';

// Define test colors for the charts
const testColors: Record<string, string> = {
    standing_long_jump: '#1f77b4',
    single_leg_jump_left: '#ff7f0e',
    single_leg_jump_right: '#2ca02c',
    single_leg_wall_sit_left: '#d62728',
    single_leg_wall_sit_right: '#9467bd',
    core_endurance_left: '#8c564b',
    core_endurance_right: '#e377c2',
    bent_arm_hang_assessment: '#7f7f7f',
};

// Define types for session data - updated to include date
interface SessionData {
    label: string;
    date: string; // Add date field for formatting
    value: number | null;
}

// Define types for test data
interface TestData {
    name: string;
    sessions: SessionData[];
    percentageIncrease: number | null;
}

// Define props interface
interface ProgressProps {
    progressData: Record<string, TestData>;
    username?: string;
    routes?: Record<string, string>;
}

// Define chart data shape - updated to include date for display
interface ChartDataPoint {
    name: string;
    formattedDate: string; // Formatted date for display on chart
    value: number;
    originalLabel: string; // Keep original label for reference
}

// Define tooltip props interface
interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: ChartDataPoint;
    }>;
}

const Progress: React.FC<ProgressProps> = ({ progressData, username = 'Athlete', routes = {} }) => {
    const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});

    // Toggle chart visibility
    const toggleTest = (testKey: string) => {
        setExpandedTests((prev) => ({
            ...prev,
            [testKey]: !prev[testKey],
        }));
    };

    // Initialize all tests as expanded by default
    useEffect(() => {
        const initialExpanded = Object.keys(progressData).reduce<Record<string, boolean>>((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});

        setExpandedTests(initialExpanded);
    }, [progressData]);

    // Helper to format dates in "MMM D" format (e.g., Jan 15)
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch (e) {
            console.error('Error formatting date:', e);
            return dateString; // Return original string if parsing fails
        }
    };

    // Format data for the charts - updated to include formatted dates
    const formatChartData = (sessions: SessionData[]): ChartDataPoint[] => {
        return sessions
            .filter((session) => session.value !== null)
            .map((session) => ({
                name: session.label,
                formattedDate: formatDate(session.date), // Use the formatted date
                originalLabel: session.label,
                value: session.value as number,
            }));
    };

    // Custom tooltip to show both formatted date and value
    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip rounded-md border border-[#1e3a5f] bg-[#0a1e3c] px-3 py-2 text-white">
                    <p className="mb-1 text-sm">{payload[0].payload.formattedDate}</p>
                    <p className="text-sm text-[#a3c0e6]">{payload[0].payload.originalLabel}</p>
                    <p className="mt-1 font-bold text-[#4a90e2]">{`${payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <Layout username={username} routes={routes} pageTitle="Your Progress">
            <Head title="Your Progress" />

            <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold text-white">YOUR PROGRESS</h2>
                <p className="text-[#a3c0e6]">
                    Track your improvement across all testing metrics. Each graph shows your results from the baseline testing through to your
                    most recent assessments.
                </p>
            </div>

            <div className="space-y-6">
                {Object.entries(progressData).map(([testKey, data]) => {
                    const chartData = formatChartData(data.sessions);
                    return (
                        <div key={testKey} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                            <button
                                onClick={() => toggleTest(testKey)}
                                className="flex w-full items-center justify-between bg-[#0a1e3c] p-4 text-left focus:outline-none"
                            >
                                <h3 className="text-xl font-bold text-white">{data.name}</h3>
                                <div className="flex items-center">
                                    {data.percentageIncrease !== null && (
                                        <span
                                            className={`mr-3 rounded-full px-3 py-1 text-sm font-medium ${
                                                data.percentageIncrease >= 0 ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'
                                            }`}
                                        >
                                            {data.percentageIncrease >= 0 ? '+' : ''}
                                            {data.percentageIncrease}%
                                        </span>
                                    )}
                                    {expandedTests[testKey] ? (
                                        <ChevronUp className="h-5 w-5 text-[#4a90e2]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#4a90e2]" />
                                    )}
                                </div>
                            </button>

                            {expandedTests[testKey] && (
                                <div className="p-4">
                                    {chartData.length === 0 ? (
                                        <p className="py-8 text-center text-[#a3c0e6]">No data available for this test yet.</p>
                                    ) : (
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                                                    <XAxis
                                                        dataKey="formattedDate" // Use formatted date for display
                                                        stroke="#a3c0e6"
                                                        tick={{ fill: '#a3c0e6' }}
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={70}
                                                    />
                                                    <YAxis stroke="#a3c0e6" tick={{ fill: '#a3c0e6' }} />
                                                    <Tooltip
                                                        content={<CustomTooltip />}
                                                        contentStyle={{
                                                            backgroundColor: '#0a1e3c',
                                                            borderColor: '#1e3a5f',
                                                            color: '#fff',
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="value"
                                                        name={data.name}
                                                        stroke={testColors[testKey] || '#4a90e2'}
                                                        strokeWidth={2}
                                                        dot={{ r: 4, strokeWidth: 2 }}
                                                        activeDot={{ r: 6 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    {data.percentageIncrease !== null && (
                                        <div className="mt-4 rounded-lg border border-[#1e3a5f] bg-[#0a1e3c]/50 p-3">
                                            <p className="text-center text-[#a3c0e6]">
                                                <span className="font-bold">Overall Improvement: </span>
                                                <span className={data.percentageIncrease >= 0 ? 'text-green-300' : 'text-red-300'}>
                                                    {data.percentageIncrease >= 0 ? '+' : ''}
                                                    {data.percentageIncrease}%
                                                </span>{' '}
                                                from baseline to latest test
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
};

export default Progress;
