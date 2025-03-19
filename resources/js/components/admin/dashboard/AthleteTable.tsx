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
    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>List of Athletes</CardTitle>
                <button
                    onClick={onAddClick}
                    className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm text-white shadow hover:from-blue-500 hover:to-indigo-500"
                >
                    Add Athlete
                </button>
            </CardHeader>
            <CardContent>
                <div className="relative overflow-x-auto shadow sm:rounded-lg">
                    <table className="w-full table-auto text-left text-sm text-gray-700 dark:text-gray-400">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th scope="col" className="px-4 py-2">
                                    Username
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Email
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Standing Long Jump
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Single Leg Jump (Left)
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Single Leg Jump (Right)
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Wall Sit
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Core Endurance
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Bent Arm Hang
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {athletes.map((athlete) => (
                                <tr
                                    key={athlete.id}
                                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                >
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                                        {athlete.username}
                                    </td>
                                    <td className="px-4 py-2">{athlete.email}</td>
                                    <td className="px-4 py-2">{athlete.training_results?.standing_long_jump || '-'}</td>
                                    <td className="px-4 py-2">{athlete.training_results?.single_leg_jump_left || '-'}</td>
                                    <td className="px-4 py-2">{athlete.training_results?.single_leg_jump_right || '-'}</td>
                                    <td className="px-4 py-2">{athlete.training_results?.wall_sit || '-'}</td>
                                    <td className="px-4 py-2">{athlete.training_results?.core_endurance || '-'}</td>
                                    <td className="px-4 py-2">{athlete.training_results?.bent_arm_hang || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
