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

interface AthleteTableProps {
    athletes: Athlete[];
    onAddClick: () => void;
}

export default function AthleteTable({ athletes, onAddClick }: AthleteTableProps) {
    if (athletes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-900/50 p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        className="h-8 w-8"
                    >
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
                    className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Your First Athlete
                </button>
            </div>
        );
    }

    return (
        <Card className="border-gray-700 bg-gray-900/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700 bg-gray-800/50">
                <CardTitle className="text-white">List of Athletes</CardTitle>
                <button
                    onClick={onAddClick}
                    className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Athlete
                </button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-left text-sm">
                        <thead className="bg-gray-800/70 text-xs uppercase text-gray-300">
                            <tr>
                                <th scope="col" className="px-4 py-3">
                                    Username
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Standing Long Jump
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Single Leg Jump (Left)
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Single Leg Jump (Right)
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Wall Sit
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Core Endurance
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Bent Arm Hang
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {athletes.map((athlete) => (
                                <tr
                                    key={athlete.id}
                                    className="border-b border-gray-700 bg-gray-900/30 hover:bg-gray-800/50"
                                >
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-blue-400">
                                        {athlete.username}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">{athlete.email}</td>
                                    <td className="px-4 py-3 text-gray-300">{athlete.training_results?.standing_long_jump || '-'} cm</td>
                                    <td className="px-4 py-3 text-gray-300">{athlete.training_results?.single_leg_jump_left || '-'} cm</td>
                                    <td className="px-4 py-3 text-gray-300">{athlete.training_results?.single_leg_jump_right || '-'} cm</td>
                                    <td className="px-4 py-3 text-gray-300">{athlete.training_results?.wall_sit || '-'} sec</td>
                                    <td className="px-4 py-3 text-gray-300">{athlete.training_results?.core_endurance || '-'} sec</td>
                                    <td className="px-4 py-3 text-gray-300">{athlete.training_results?.bent_arm_hang || '-'} sec</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
