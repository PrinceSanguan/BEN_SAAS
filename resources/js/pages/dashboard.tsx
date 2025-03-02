import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ActivitySquare, Award, BarChart3, Home, Settings, Star, TrendingUp, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {

  const achievementProgress = 85;
  const currentExp = 3000;
  const maxExp = 5000;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - achievementProgress / 100);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Profile Card */}
        <Card className="relative overflow-hidden border-2 border-gray-200 shadow-md dark:border-gray-800">
          <div className="absolute top-0 right-0 h-24 w-24">
            <div className="relative h-full w-full overflow-hidden">
              <div className="absolute -top-12 -right-12 h-24 w-24 rotate-45 bg-green-500" />
            </div>
          </div>

          <CardContent className="pt-6 pb-10">
            <div className="mt-4 mb-20 flex items-center justify-center">
              <div className="relative inline-flex h-40 w-40 items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="#e6e6e6" strokeWidth="4" className="dark:stroke-gray-700" />
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} transform="rotate(-90 60 60)" className="transition-all duration-1000 ease-in-out" />
                </svg>

                <Avatar className="absolute left-1/2 top-1/2 z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-lg dark:border-gray-800">
                  <AvatarImage
                    src="/avatar-placeholder.png"
                    alt="Athlete"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg">Avatar</AvatarFallback>
                </Avatar>

                <div className="absolute bottom-[-1rem] left-1/2 z-20 flex -translate-x-1/2 translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-md dark:bg-gray-800">
                  <Star className="mr-1 inline-block h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold">
                    {currentExp}/{maxExp} EXP
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 place-items-center md:grid-cols-4 md:gap-6">
              {/* Athlete Name */}
              <div className="flex flex-col items-center justify-center w-32 h-32 p-3 border rounded-lg shadow-sm transition-all bg-gray-50 border-gray-200 hover:border-blue-200 hover:bg-blue-50 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-gray-800 md:w-64 md:h-32">
                <User className="mb-2 h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Athlete Name:</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">John Doe</span>
              </div>

              {/* Level */}
              <div className="flex flex-col items-center justify-center w-32 h-32 p-3 border rounded-lg shadow-sm transition-all bg-gray-50 border-gray-200 hover:border-blue-200 hover:bg-blue-50 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-blue-900 dark:hover:bg-gray-800 md:w-64 md:h-32">
                <TrendingUp className="mb-2 h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Level:</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Advanced</span>
              </div>

              {/* Consistency Score */}
              <div className="flex flex-col items-center justify-center w-32 h-32 p-3 border rounded-lg shadow-sm transition-all bg-gray-50 border-gray-200 hover:border-green-200 hover:bg-green-50 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-green-900 dark:hover:bg-gray-800 md:w-64 md:h-32">
                <BarChart3 className="mb-2 h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Consistency Score:
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {achievementProgress}%
                </span>
              </div>
              {/* Rank */}
              <div className="flex flex-col items-center justify-center w-32 h-32 p-3 border rounded-lg shadow-sm transition-all bg-gray-50 border-gray-200 hover:border-purple-200 hover:bg-purple-50 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-purple-900 dark:hover:bg-gray-800 md:w-64 md:h-32">
                <Award className="mb-2 h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Rank:
                </span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  #12
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboards */}
        <Card className="border-2 border-gray-200 shadow-md dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-base font-bold text-gray-800 dark:text-gray-200">
              Athlete Level Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">#{i}</span>
                    <Avatar className="h-8 w-8 border border-gray-200 shadow-sm dark:border-gray-700">
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                        U{i}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">User {i}</span>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    Lvl {Math.floor(Math.random() * 10) + 5}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 shadow-md dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-base font-bold text-gray-800 dark:text-gray-200">
              Consistency Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-green-200 hover:bg-green-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-900 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">#{i}</span>
                    <Avatar className="h-8 w-8 border border-gray-200 shadow-sm dark:border-gray-700">
                      <AvatarFallback className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200">
                        U{i}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">User {i}</span>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-600 dark:bg-green-900 dark:text-green-200">
                    {90 - i * 5}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="fixed right-0 bottom-0 left-0 flex justify-around border-t border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <button className="flex flex-col items-center justify-center rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800">
            <Home size={22} />
            <span className="mt-1 text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <ActivitySquare size={22} />
            <span className="mt-1 text-xs font-medium">Your Training</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <Settings size={22} />
            <span className="mt-1 text-xs font-medium">Settings</span>
          </button>
        </div>

        <div className="h-16"></div>
      </div>
    </AppLayout>
  );
}
