import AdminSidebar from '@/components/admin/AdminSidebar';
import { Head } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

interface Props {
    logs: string[];
    activePage: string;
}

export default function SubmissionLogs({ logs, activePage }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Parse log entries
    const parsedLogs = logs.map((log, index) => {
        const isError = log.includes('ERROR') || log.includes('verification failed');
        const isSuccess = log.includes('Training score save result') && !isError;
        const isSubmission = log.includes('Training score submission');

        // Extract timestamp and make it more readable
        const timestampMatch = log.match(/\[([\d\-\s:]+)\]/);
        const rawTimestamp = timestampMatch ? timestampMatch[1] : 'Unknown';

        // Format timestamp to be more user-friendly
        let friendlyTimestamp = 'Unknown time';
        if (rawTimestamp !== 'Unknown') {
            try {
                const date = new Date(rawTimestamp);
                friendlyTimestamp = date.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
            } catch {
                friendlyTimestamp = rawTimestamp;
            }
        }

        // Extract user info with multiple regex patterns to handle different log formats
        const userMatch = log.match(/user_id.*?[:\s]+(\d+)/);

        // Try multiple patterns for username extraction
        let username = 'Unknown athlete';
        const usernamePatterns = [
            /"username"\s*:\s*"([^"]+)"/, // JSON format: "username":"name"
            /username.*?[:\s]+"([^"]+)"/, // Key-value format: username: "name"
            /username[:\s]+([^\s,\]}"]+)/, // Without quotes: username: name
        ];

        for (const pattern of usernamePatterns) {
            const match = log.match(pattern);
            if (match && match[1] && match[1].trim() !== '') {
                username = match[1].trim();
                break;
            }
        }

        const sessionMatch = log.match(/session_id.*?[:\s]+(\d+)/);

        // Extract block and week info for context with improved patterns
        const blockMatch = log.match(/block_number.*?[:\s]+"?([^"',\s\]]+)"?/);
        const weekMatch = log.match(/week_number.*?[:\s]+(\d+)/);

        return {
            id: index,
            raw: log,
            timestamp: friendlyTimestamp,
            userId: userMatch ? userMatch[1] : 'Unknown',
            username: username,
            sessionId: sessionMatch ? sessionMatch[1] : 'Unknown',
            blockNumber: blockMatch ? blockMatch[1] : 'Unknown',
            weekNumber: weekMatch ? weekMatch[1] : 'Unknown',
            type: isError ? 'error' : isSuccess ? 'success' : isSubmission ? 'submission' : 'info',
            isError,
            isSuccess,
            isSubmission,
        };
    });

    // Filter logs
    const filteredLogs = parsedLogs.filter((log) => {
        const matchesSearch =
            searchTerm === '' ||
            log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.sessionId.includes(searchTerm) ||
            log.blockNumber.includes(searchTerm) ||
            log.weekNumber.includes(searchTerm);

        const matchesFilter = filterType === 'all' || log.type === filterType;

        return matchesSearch && matchesFilter;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <AlertTriangle className="h-5 w-5 text-red-400" />;
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            case 'submission':
                return <FileText className="h-5 w-5 text-blue-400" />;
            default:
                return <Clock className="h-5 w-5 text-gray-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'error':
                return 'bg-red-900/20 border-red-800 text-red-200';
            case 'success':
                return 'bg-green-900/20 border-green-800 text-green-200';
            case 'submission':
                return 'bg-blue-900/20 border-blue-800 text-blue-200';
            default:
                return 'bg-gray-900/20 border-gray-800 text-gray-200';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'error':
                return 'Issue Found';
            case 'success':
                return 'Successfully Saved';
            case 'submission':
                return 'Score Submitted';
            default:
                return 'Activity';
        }
    };

    const getTypeDescription = (type: string) => {
        switch (type) {
            case 'error':
                return 'There was a problem saving the scores';
            case 'success':
                return 'Scores were saved successfully';
            case 'submission':
                return 'Athlete submitted their scores';
            default:
                return 'System activity';
        }
    };

    return (
        <>
            <Head title="Submission Logs - Admin" />
            <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
                <AdminSidebar activePage="submission-logs" />

                <main className="ml-0 flex-1 overflow-auto p-4 md:ml-64 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="mb-2 text-3xl font-bold text-white">Athlete Score Activity</h1>
                            <p className="text-gray-300">
                                Track when athletes submit their training scores and verify everything is working correctly
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by athlete name, session, or block number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="all">Show All Activity</option>
                                <option value="submission">Score Submissions Only</option>
                                <option value="success">Successfully Saved Only</option>
                                <option value="error">Issues Only</option>
                            </select>
                        </div>

                        {/* Stats */}
                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                                <div className="text-sm text-gray-400">Total Activities</div>
                                <div className="text-2xl font-bold text-white">{parsedLogs.length}</div>
                            </div>
                            <div className="rounded-lg border border-blue-800 bg-blue-900/30 p-4">
                                <div className="text-sm text-blue-300">Score Submissions</div>
                                <div className="text-2xl font-bold text-white">{parsedLogs.filter((l) => l.isSubmission).length}</div>
                            </div>
                            <div className="rounded-lg border border-green-800 bg-green-900/30 p-4">
                                <div className="text-sm text-green-300">Successfully Saved</div>
                                <div className="text-2xl font-bold text-white">{parsedLogs.filter((l) => l.isSuccess).length}</div>
                            </div>
                            <div className="rounded-lg border border-red-800 bg-red-900/30 p-4">
                                <div className="text-sm text-red-300">Issues Found</div>
                                <div className="text-2xl font-bold text-white">{parsedLogs.filter((l) => l.isError).length}</div>
                            </div>
                        </div>

                        {/* Logs */}
                        <div className="space-y-3">
                            {filteredLogs.length === 0 ? (
                                <div className="py-12 text-center text-gray-400">No activity found matching your search</div>
                            ) : (
                                filteredLogs.map((log) => (
                                    <div key={log.id} className={`rounded-xl border p-5 ${getTypeColor(log.type)} transition-all hover:shadow-lg`}>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex-shrink-0">{getIcon(log.type)}</div>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-3 flex flex-wrap items-center gap-3">
                                                    <span className="text-base font-semibold">{getTypeLabel(log.type)}</span>
                                                    <span className="text-sm opacity-80">{log.timestamp}</span>
                                                </div>

                                                <div className="mb-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                                                    <div>
                                                        <span className="opacity-70">Athlete: </span>
                                                        <span className="font-medium">{log.username}</span>
                                                    </div>
                                                    {log.blockNumber !== 'Unknown' && (
                                                        <div>
                                                            <span className="opacity-70">Block: </span>
                                                            <span className="font-medium">{log.blockNumber}</span>
                                                            {log.weekNumber !== 'Unknown' && (
                                                                <span className="opacity-70"> • Week {log.weekNumber}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="opacity-70">Session: </span>
                                                        <span className="font-medium">#{log.sessionId}</span>
                                                    </div>
                                                </div>

                                                <p className="mb-2 text-sm opacity-80">{getTypeDescription(log.type)}</p>

                                                <details className="mt-3">
                                                    <summary className="cursor-pointer text-xs opacity-60 transition-opacity hover:opacity-100">
                                                        View technical details
                                                    </summary>
                                                    <div className="mt-2 max-h-32 overflow-auto rounded-lg bg-black/20 p-3 font-mono text-xs break-all opacity-70">
                                                        {log.raw}
                                                    </div>
                                                </details>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Info */}
                        <div className="mt-8 rounded-xl border border-blue-800 bg-blue-900/20 p-6">
                            <h3 className="mb-3 text-lg font-semibold text-blue-300">Understanding Activity Types</h3>
                            <div className="grid grid-cols-1 gap-4 text-sm text-blue-200 md:grid-cols-3">
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-400" />
                                        <strong>Score Submitted</strong>
                                    </div>
                                    <p className="opacity-80">When an athlete submits their training scores</p>
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                        <strong>Successfully Saved</strong>
                                    </div>
                                    <p className="opacity-80">Scores were verified and saved to the database</p>
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-400" />
                                        <strong>Issue Found</strong>
                                    </div>
                                    <p className="opacity-80">There was a problem that needs attention</p>
                                </div>
                            </div>
                            <div className="mt-4 rounded-lg bg-blue-900/30 p-3">
                                <p className="text-xs text-blue-200">
                                    💡 <strong>Tip:</strong> If you see multiple "Issue Found" entries for the same athlete, this indicates a problem
                                    that may need manual correction. You can use the correction tool to fix any missing or incorrect scores.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
