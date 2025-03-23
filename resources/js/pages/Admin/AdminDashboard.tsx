import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
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
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    // Stats for the dashboard
    const numberOfUsers = athletes.length;
    const numberOfActive = athletes.filter((a) => a.training_results !== undefined).length;
    const numberOfOnline = Math.min(numberOfUsers, 1); // Placeholder

    // Form state using the useAthleteForm hook
    const { form, showModal, setShowModal, handleChange, handleSubmit, isSubmitting, error } = useAthleteForm(athletes, setAthletes);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            {/* Sidebar */}
            <AdminSidebar activePage="dashboard" />

            {/* Main Content */}
            <main className="ml-64 flex-1 p-6">
                <Head title="Admin Dashboard" />
                <div className="space-y-6 px-2 sm:px-4 lg:px-0">
                    {/* Top Section: "Add Athlete" button + Stats Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Button to open the Add Athlete modal */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="rounded-lg bg-gradient-to-r px-4 py-2 transition-all duration-300"
                        >
                        </button>

                        {/* Stats Cards */}
                        <StatsCards
                            numberOfUsers={numberOfUsers}
                            numberOfActive={numberOfActive}
                            numberOfOnline={numberOfOnline}
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                    </div>

                    {/* Content Container with Blue Theme */}
                    <div className="rounded-xl bg-[#112845] shadow-lg border border-[#1e3a5f] p-6">
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
