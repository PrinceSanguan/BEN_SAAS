import { Link } from '@inertiajs/react';
import { Activity, Award, BarChart2, Home, LogOut, TrendingUp, Trophy, User } from 'lucide-react';
import { useRef } from 'react';

interface SidebarProps {
    username: string;
    routes?: {
        [key: string]: string;
    };
    currentRoute?: string; // To highlight the active route
}

const Sidebar: React.FC<SidebarProps> = ({ username, routes = {}, currentRoute = '' }) => {
    const navRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Use hardcoded fallback routes if not provided in props
    const getRoute = (name: string): string => {
        // Check if routes object exists and contains the route
        if (routes && routes[name]) {
            return routes[name];
        }

        // Check if window.route function is available (Ziggy)
        if (typeof window !== 'undefined' && window.route && typeof window.route === 'function') {
            try {
                return window.route(name);
            } catch (e) {
                console.error('Error using window.route:', e);
            }
        }

        // Fallback routes
        const fallbackRoutes: Record<string, string> = {
            'student.dashboard': '/dashboard',
            'student.training': '/training',
            'student.progress': '/progress',
            'student.settings': '/settings',
            'leaderboard.strength': '/leaderboard/strength',
            'leaderboard.consistency': '/leaderboard/consistency',
            'admin.logout': '/logout',
        };

        return fallbackRoutes[name] || '#';
    };

    // Check if a route is active
    const isActive = (routeName: string): boolean => {
        // Get route path
        const routePath = getRoute(routeName);

        // Special case for dashboard which might be "/dashboard" or end with "/dashboard"
        if (routeName === 'student.dashboard') {
            return currentRoute === '/' || currentRoute.endsWith('/dashboard') || currentRoute === routePath;
        }

        // Handle training routes
        if (routeName === 'student.training') {
            return currentRoute.includes('/training');
        }

        // Handle progress route
        if (routeName === 'student.progress') {
            return currentRoute.includes('/progress');
        }

        // Handle strength leaderboard
        if (routeName === 'leaderboard.strength') {
            return currentRoute.includes('/leaderboard/strength');
        }

        // Handle consistency leaderboard
        if (routeName === 'leaderboard.consistency') {
            return currentRoute.includes('/leaderboard/consistency');
        }

        // Default comparison
        return currentRoute.includes(routePath);
    };

    return (
        <div ref={sidebarRef} className="fixed z-10 h-full w-64 border-r border-[#1e3a5f] bg-[#0a1e3c]">
            <div className="flex h-16 items-center border-b border-[#1e3a5f] px-6">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
                    <Trophy className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">AthleteTrack</h1>
            </div>
            <div className="border-b border-[#1e3a5f] p-4">
                <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f]">
                        <User className="h-5 w-5 text-[#4a90e2]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-white">{username}</h2>
                        <p className="text-xs text-[#a3c0e6]">Athlete</p>
                    </div>
                </div>
            </div>
            <nav ref={navRef} className="space-y-1 p-4">
                <Link
                    href={getRoute('student.dashboard')}
                    className={`flex items-center rounded-md px-4 py-3 transition-colors hover:bg-[#1e3a5f]/80 ${
                        isActive('student.dashboard') ? 'bg-[#1e3a5f] text-white' : 'text-[#a3c0e6] hover:text-white'
                    }`}
                >
                    <Home className="mr-3 h-5 w-5 text-[#4a90e2]" />
                    <span>Dashboard</span>
                </Link>
                <a
                    href="https://youngathletetraining.co.uk"
                    target="_blank"
                    className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f]/40 hover:text-white"
                >
                    <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
                    <span>Training Sessions</span>
                </a>
                <Link
                    href={getRoute('student.training')}
                    className={`flex items-center rounded-md px-4 py-3 transition-colors hover:bg-[#1e3a5f]/80 ${
                        isActive('student.training') ? 'bg-[#1e3a5f] text-white' : 'text-[#a3c0e6] hover:text-white'
                    }`}
                >
                    <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
                    <span>Training Diary</span>
                </Link>
                <Link
                    href={getRoute('student.progress')}
                    className={`flex items-center rounded-md px-4 py-3 transition-colors hover:bg-[#1e3a5f]/80 ${
                        isActive('student.progress') ? 'bg-[#1e3a5f] text-white' : 'text-[#a3c0e6] hover:text-white'
                    }`}
                >
                    <TrendingUp className="mr-3 h-5 w-5 text-[#4a90e2]" />
                    <span>Progress</span>
                </Link>

                <div className="pt-4">
                    <h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#63b3ed]">Leaderboards</h3>
                    <Link
                        href={getRoute('leaderboard.strength')}
                        className={`flex items-center rounded-md px-4 py-3 transition-colors hover:bg-[#1e3a5f]/80 ${
                            isActive('leaderboard.strength') ? 'bg-[#1e3a5f] text-white' : 'text-[#a3c0e6] hover:text-white'
                        }`}
                    >
                        <Award className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Strength</span>
                    </Link>
                    <Link
                        href={getRoute('leaderboard.consistency')}
                        className={`flex items-center rounded-md px-4 py-3 transition-colors hover:bg-[#1e3a5f]/80 ${
                            isActive('leaderboard.consistency') ? 'bg-[#1e3a5f] text-white' : 'text-[#a3c0e6] hover:text-white'
                        }`}
                    >
                        <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2]" />
                        <span>Consistency</span>
                    </Link>
                </div>
            </nav>
            <div className="absolute bottom-0 w-full border-t border-[#1e3a5f] p-4">
                <Link
                    href={getRoute('admin.logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center rounded-lg px-4 py-3 text-[#a3c0e6] transition-colors hover:bg-[#112845] hover:text-white"
                    preserveScroll
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
