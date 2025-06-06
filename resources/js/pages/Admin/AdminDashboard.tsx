import AdminSidebar from '@/components/admin/AdminSidebar';
import AddAthleteModal from '@/components/admin/dashboard/AddAthleteModal';
import AthleteCards from '@/components/admin/dashboard/AthleteCards';
import AthleteTable from '@/components/admin/dashboard/AthleteTable';
import NoAthletes from '@/components/admin/dashboard/NoAthletes';
import StatsCards from '@/components/admin/dashboard/StatsCards';
import useAthleteForm from '@/components/admin/dashboard/useAthleteForm';
import ViewToggle from '@/components/admin/dashboard/ViewToggle';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/** Athlete Type */
type Athlete = {
    id: number;
    username: string;
    email: string;
    consistency_score?: number;
    strength_level?: number;
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
    bent_arm_enabled?: boolean;
};

type Props = {
    athletes?: Athlete[];
};

// Import the Notification component
import Notification from '@/components/admin/dashboard/Notification';

export default function AdminDashboard({ athletes: initialAthletes = [] }: Props) {
    // Get flash messages from the session
    const { flash } = usePage().props as any;

    // State for athletes (initialized from props)
    const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);

    // State for view mode (table or cards)
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards'); // Default to cards on mobile

    // State for sidebar visibility on mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // State for notification
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Effect to handle flash messages from server
    useEffect(() => {
        if (flash?.success) {
            setNotification({ message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setNotification({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    // Effect to add new athlete to the list if returned from the backend
    useEffect(() => {
        if (flash?.newAthlete) {
            setAthletes((prevAthletes) => [...prevAthletes, flash.newAthlete]);
        }
    }, [flash?.newAthlete]);

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
    const {
        form,
        setForm,
        showModal,
        setShowModal,
        showConfirmation,
        setShowConfirmation,
        handleChange,
        handleCheckboxChange,
        handleSubmit,
        confirmSubmit,
        cancelSubmit,
        isSubmitting,
        error,
        formattedData,
    } = useAthleteForm(athletes, setAthletes);

    // Handle athlete updates for the cards view
    const handleUpdateAthlete = (athleteId: number, updatedData: Partial<Athlete>) => {
        setAthletes((prevAthletes) => prevAthletes.map((athlete) => (athlete.id === athleteId ? { ...athlete, ...updatedData } : athlete)));
    };

    // Handle athlete deletion from the UI (the actual deletion happens in AthleteCards)
    const handleAthleteDeleted = (deletedId: number) => {
        setAthletes((prevAthletes) => prevAthletes.filter((athlete) => athlete.id !== deletedId));
        setNotification({ message: 'Athlete deleted successfully!', type: 'success' });
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <AdminSidebar activePage="dashboard" />
            </div>

            {/* Mobile Bottom Tab Navigation */}
            <div className="block md:hidden">
                <AdminSidebar activePage="dashboard" isMobile={true} />
            </div>

            {/* Notification */}
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            {/* Main Content */}
            <main className="flex-1 p-4 pt-6 pb-24 md:ml-64 md:p-6 md:pt-6 md:pb-6">
                <Head title="Admin Dashboard" />
                <div className="space-y-6">
                    {/* Top Section: Title and "Add Athlete" button */}
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>

                        {/* Button to open the Add Athlete modal */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-800 sm:w-auto"
                        >
                            Add Athlete
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <StatsCards numberOfUsers={numberOfUsers} numberOfActive={numberOfActive} numberOfOnline={numberOfOnline} />

                    {/* View Mode Toggle - Hidden on small screens */}
                    <div className="hidden items-center justify-between md:flex">
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                    </div>

                    {/* Content Container with Blue Theme */}
                    <div className="rounded-xl border border-[#1e3a5f] bg-[#112845] p-4 shadow-lg md:p-6">
                        {/* Athlete Cards View */}
                        {viewMode === 'cards' && athletes.length > 0 && <AthleteCards athletes={athletes} onAddClick={() => setShowModal(true)} />}

                        {/* Table of Athletes */}
                        {viewMode === 'table' && athletes.length > 0 && (
                            <AthleteTable athletes={athletes as any} onAddClick={() => setShowModal(true)} />
                        )}
                        {/* "No Athletes" message when there are no athletes */}
                        {athletes.length === 0 && <NoAthletes onAddClick={() => setShowModal(true)} />}
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
                    handleCheckboxChange={handleCheckboxChange}
                />
            </main>
        </div>
    );
}
