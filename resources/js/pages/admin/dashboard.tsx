import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Settings } from 'lucide-react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Card className="border-2 border-gray-200 shadow-md dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-bold text-gray-800 dark:text-gray-200">Thank you!</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600">
                            <Settings size={20} />
                            Settings
                        </button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
