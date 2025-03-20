import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface AthleteCardsProps {
    athletes: Athlete[];
    onAddClick: () => void;
}

export default function AthleteCards({ athletes, onAddClick }: AthleteCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Add Athlete Card */}
            <div
                onClick={onAddClick}
                className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-8 w-8"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Add Athlete</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new athlete to your team</p>
            </div>

            {/* Athlete Cards */}
            {athletes.map((athlete) => (
                <Card key={athlete.id} className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <CardTitle>{athlete.username}</CardTitle>
                        <p className="text-sm text-gray-100">{athlete.email}</p>
                    </CardHeader>
                    <CardContent className="p-4">
                        <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Pre-Training Results</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="font-medium text-gray-600 dark:text-gray-300">Standing Long Jump:</p>
                                <p>{athlete.training_results?.standing_long_jump || '-'} cm</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600 dark:text-gray-300">Single Leg Jump (L):</p>
                                <p>{athlete.training_results?.single_leg_jump_left || '-'} cm</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600 dark:text-gray-300">Single Leg Jump (R):</p>
                                <p>{athlete.training_results?.single_leg_jump_right || '-'} cm</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600 dark:text-gray-300">Wall Sit:</p>
                                <p>{athlete.training_results?.wall_sit || '-'} sec</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600 dark:text-gray-300">Core Endurance:</p>
                                <p>{athlete.training_results?.core_endurance || '-'} sec</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600 dark:text-gray-300">Bent Arm Hang:</p>
                                <p>{athlete.training_results?.bent_arm_hang || '-'} sec</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
