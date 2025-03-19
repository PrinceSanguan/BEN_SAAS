import { Button } from '@/components/ui/button';
import React from 'react';

const StudentDashboard: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100">
            <h1 className="mb-4 text-4xl font-bold text-blue-600">Welcome to the Student Dashboard</h1>
            <p className="mb-6 text-lg text-gray-700">Your one-stop platform for all student resources and updates.</p>
            <Button className="rounded-xl bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600">Explore Resources</Button>
        </div>
    );
};

export default StudentDashboard;
