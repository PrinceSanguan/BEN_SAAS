import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsCards from '@/components/admin/dashboard/StatsCards';
import ViewToggle from '@/components/admin/dashboard/ViewToggle';
import AthleteCards from '@/components/admin/dashboard/AthleteCards';
import AthleteTable from '@/components/admin/dashboard/AthleteTable';
import NoAthletes from '@/components/admin/dashboard/NoAthletes';
import AddAthleteModal from '@/components/admin/dashboard/AddAthleteModal';
import useAthleteForm from '@/components/admin/dashboard/useAthleteForm';

/** Athlete Type */
type Athlete = {
    id: number;
    username: string;
    email: string;
    training_results?: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        wall_sit: number | null;
        core_endurance: number | null;
        bent_arm_hang: number | null;
    };
};

type Props = {
    athletes?: Athlete[];
};

export default function AdminDashboard({ athletes: initialAthletes = [] }: Props) {
    // State for athletes (initialized from props)
    const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);

    // State for view mode (table or cards)
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards'); // Default to cards on mobile

    // State for sidebar visibility on mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Set the default view mode based on screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;

            if (mobile) {
                setViewMode('cards');
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Stats for the dashboard
    const numberOfUsers = athletes.length;
    const numberOfActive = athletes.filter((a) => a.training_results !== undefined).length;
    const numberOfOnline = Math.min(numberOfUsers, 1); // Placeholder

    // Form state using the useAthleteForm hook
    const { form, showModal, setShowModal, handleChange, handleSubmit, isSubmitting, error } = useAthleteForm(athletes, setAthletes);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <AdminSidebar activePage="dashboard" />
            </div>

            {/* Mobile Bottom Tab Navigation */}
            <div className="block md:hidden">
                <AdminSidebar
                    activePage="dashboard"
                    isMobile={true}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 pt-6 pb-24 md:p-6 md:pt-6 md:pb-6 md:ml-64">
                <Head title="Admin Dashboard" />
                <div className="space-y-6">
                    {/* Top Section: Title and "Add Athlete" button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>

                        {/* Button to open the Add Athlete modal */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-white font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-800"
                        >
                            Add Athlete
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <StatsCards
                        numberOfUsers={numberOfUsers}
                        numberOfActive={numberOfActive}
                        numberOfOnline={numberOfOnline}
                    />

                    {/* View Mode Toggle - Hidden on small screens */}
                    <div className="hidden md:flex items-center justify-between">
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                    </div>

                    {/* Content Container with Blue Theme */}
                    <div className="rounded-xl bg-[#112845] shadow-lg border border-[#1e3a5f] p-4 md:p-6">
                        {/* Athlete Cards View */}
                        {viewMode === 'cards' && athletes.length > 0 && (
                            <AthleteCards athletes={athletes} onAddClick={() => setShowModal(true)} />
                        )}

                        {/* Table of Athletes */}
                        {viewMode === 'table' && athletes.length > 0 && (
                            <AthleteTable athletes={athletes} onAddClick={() => setShowModal(true)} />
                        )}

                        {/* "No Athletes" message when there are no athletes */}
                        {athletes.length === 0 && (
                            <NoAthletes onAddClick={() => setShowModal(true)} />
                        )}
                    </div>
                </div>

                {/* MODAL for Adding a New Athlete */}
                <AddAthleteModal
                    showModal={showModal}
                    form={form}
                    error={error}
                    isSubmitting={isSubmitting}
                    onClose={() => setShowModal(false)}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            </main>
        </div>
    );
}
