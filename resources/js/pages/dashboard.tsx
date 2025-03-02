import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ActivitySquare, Home, Settings } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Profile Card with Avatar */}
                <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-800">
                    <div className="absolute top-0 right-0 h-20 w-20">
                        <div className="relative h-full w-full overflow-hidden">
                            <div className="absolute -top-10 -right-10 h-20 w-20 rotate-45 bg-green-500"></div>
                        </div>
                    </div>

                    <CardContent className="pt-6">
                        <div className="mt-4 mb-6 flex items-center justify-center">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-md dark:border-gray-800">
                                    <AvatarImage src="/avatar-placeholder.png" alt="Athlete" />
                                    <AvatarFallback>Avatar</AvatarFallback>
                                </Avatar>
                                <div className="absolute -right-1 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md dark:bg-gray-800">
                                    <div className="h-6 w-6 rounded-full border-2 border-white bg-green-500 dark:border-gray-800"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Athlete Name:</span>
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">John Doe</span>
                            </div>

                            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Level:</span>
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Advanced</span>
                            </div>

                            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Consistency Score:</span>
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">85%</span>
                            </div>

                            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Rank:</span>
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">#12</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Leaderboard Cards */}
                <Card className="border-2 border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center text-base">Athlete Level Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">#{i}</span>
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback>U{i}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">User {i}</span>
                                    </div>
                                    <span className="text-sm font-semibold">Lvl {Math.floor(Math.random() * 10) + 5}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center text-base">Consistency Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">#{i}</span>
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback>U{i}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">User {i}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Progress value={90 - i * 5} className="h-2 w-16" />
                                        <span className="text-xs">{90 - i * 5}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Bottom Navigation */}
                <div className="fixed right-0 bottom-0 left-0 flex justify-around border-t border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-950">
                    <button className="flex flex-col items-center justify-center p-2 text-blue-600 dark:text-blue-400">
                        <Home size={20} />
                        <span className="mt-1 text-xs">Home</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 text-gray-500 dark:text-gray-400">
                        <ActivitySquare size={20} />
                        <span className="mt-1 text-xs">Your Training</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 text-gray-500 dark:text-gray-400">
                        <Settings size={20} />
                        <span className="mt-1 text-xs">Settings</span>
                    </button>
                </div>

                {/* Spacer for the fixed bottom navigation */}
                <div className="h-16"></div>
            </div>
        </AppLayout>
    );
}
