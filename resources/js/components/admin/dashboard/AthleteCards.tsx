import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Athlete = {
    id: number;
    username: string;
    email: string;
    training_results?: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        single_leg_wall_sit_left: number | null;
        single_leg_wall_sit_right: number | null;
        core_endurance: number | null;
        bent_arm_hang: number | null;
    };
};

interface AthleteCardsProps {
    athletes: Athlete[];
    onAddClick: () => void;
}

export default function AthleteCards({ athletes, onAddClick }: AthleteCardsProps) {
    if (athletes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-900/50 p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="h-8 w-8">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white">No Athletes Found</h2>
                <p className="mb-6 text-gray-400">Get started by adding a new athlete to your team.</p>
                <button
                    onClick={onAddClick}
                    className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Add Your First Athlete
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Add Athlete Card */}
            <div
                onClick={onAddClick}
                className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-900/50 p-6 transition-colors hover:bg-gray-800/70"
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                <h3 className="mt-3 text-lg font-medium text-white">Add Athlete</h3>
                <p className="mt-1 text-sm text-gray-400">Add a new athlete to your team</p>
            </div>

            {/* Athlete Cards */}
            {athletes.map((athlete) => (
                <Card
                    key={athlete.id}
                    className="overflow-hidden rounded-lg border-gray-700 bg-gray-900/50 shadow-lg transition-all hover:shadow-blue-500/10"
                >
                    <CardHeader className="border-b border-gray-700 bg-gray-800/50 pt-3 pb-3">
                        <CardTitle className="text-white">{athlete.username}</CardTitle>
                        <p className="text-sm text-gray-400">{athlete.email}</p>
                    </CardHeader>
                    <CardContent className="p-4">
                        <h3 className="mb-3 font-semibold text-blue-400">Pre-Training Results</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-md bg-gray-800/50 p-2">
                                <p className="font-medium text-gray-400">Standing Long Jump:</p>
                                <p className="text-white">{athlete.training_results?.standing_long_jump || '-'} cm</p>
                            </div>
                            <div className="rounded-md bg-gray-800/50 p-2">
                                <p className="font-medium text-gray-400">Single Leg Jump (L):</p>
                                <p className="text-white">{athlete.training_results?.single_leg_jump_left || '-'} cm</p>
                            </div>
                            <div className="rounded-md bg-gray-800/50 p-2">
                                <p className="font-medium text-gray-400">Single Leg Jump (R):</p>
                                <p className="text-white">{athlete.training_results?.single_leg_jump_right || '-'} cm</p>
                            </div>
                            <div className="rounded-md bg-gray-800/50 p-2">
                                <p className="font-medium text-gray-400">Single Leg Wall Sit (L):</p>
                                <p className="text-white">{athlete.training_results?.single_leg_wall_sit_left || '-'} sec</p>
                            </div>
                            <div className="rounded-md bg-gray-800/50 p-2">
                                <p className="font-medium text-gray-400">Single Leg Wall Sit (R):</p>
                                <p className="text-white">{athlete.training_results?.single_leg_wall_sit_right || '-'} sec</p>
                            </div>
                            <div className="rounded-md bg-gray-800/50 p-2">
                                <p className="font-medium text-gray-400">Core Endurance:</p>
                                <p className="text-white">{athlete.training_results?.core_endurance || '-'} sec</p>
                            </div>
                            <div className="rounded-md bg-gray-800/50 p-2">
                                <p className="font-medium text-gray-400">Bent Arm Hang:</p>
                                <p className="text-white">{athlete.training_results?.bent_arm_hang || '-'} sec</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
