import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  ChevronUp,
  ChevronDown,
  Home,
  Activity,
  Award,
  BarChart2,
  Trophy,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

// Define test colors for the charts
const testColors: Record<string, string> = {
  standing_long_jump: '#1f77b4',
  single_leg_jump_left: '#ff7f0e',
  single_leg_jump_right: '#2ca02c',
  wall_sit_assessment: '#d62728',
  high_plank_assessment: '#9467bd',
  bent_arm_hang_assessment: '#8c564b'
};

// Define types for session data
interface SessionData {
  label: string;
  value: number | null;
}

// Define types for test data
interface TestData {
  name: string;
  sessions: SessionData[];
  percentageIncrease: number | null;
}

// Define props interface
interface ProgressProps {
  progressData: Record<string, TestData>;
  username?: string;
  routes?: Record<string, string>;
}

// Define chart data shape
interface ChartDataPoint {
  name: string;
  value: number;
}

const Progress: React.FC<ProgressProps> = ({ progressData, username = 'Athlete', routes = {} }) => {
  const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Responsive check
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Toggle chart visibility
  const toggleTest = (testKey: string) => {
    setExpandedTests(prev => ({
      ...prev,
      [testKey]: !prev[testKey]
    }));
  };

  // Initialize all tests as expanded by default
  useEffect(() => {
    const initialExpanded = Object.keys(progressData).reduce<Record<string, boolean>>((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setExpandedTests(initialExpanded);
  }, [progressData]);

  // Helper to generate route URLs
  const getRoute = (name: string, params?: Record<string, string | number>): string => {
    // Check if routes object exists and contains the route
    if (routes && routes[name]) {
      return routes[name];
    }

    // Check if window.route function is available (Ziggy)
    if (typeof window !== 'undefined' && window.route && typeof window.route === 'function') {
      try {
        return window.route(name, params);
      } catch (e) {
        console.error('Error using window.route:', e);
      }
    }

    // Fallback routes
    const fallbackRoutes: Record<string, string> = {
      'student.dashboard': '/dashboard',
      'student.training': '/training',
      'student.progress': '/progress',
      'leaderboard.strength': '/leaderboard/strength',
      'leaderboard.consistency': '/leaderboard/consistency',
      'admin.logout': '/logout',
    };

    return fallbackRoutes[name] || '#';
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Format data for the charts
  const formatChartData = (sessions: SessionData[]): ChartDataPoint[] => {
    return sessions
      .filter(session => session.value !== null)
      .map(session => ({
        name: session.label,
        value: session.value as number
      }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
      <Head title="Your Progress" />

      {/* Sidebar (Desktop) */}
      <div className="fixed z-30 hidden h-full border-r border-[#1e3a5f] bg-[#0a1e3c] lg:flex lg:w-64 lg:flex-col">
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
        <nav className="flex-1 space-y-1 px-2 py-4">
          <Link
            href={getRoute('student.dashboard')}
            className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
          >
            <Home className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
            <span className="group-hover:text-white">Dashboard</span>
          </Link>
          <Link
            href={getRoute('student.training')}
            className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
          >
            <Activity className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
            <span className="group-hover:text-white">Training</span>
          </Link>
          <Link
            href={getRoute('student.progress')}
            className="group flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white"
          >
            <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2]" />
            <span>Progress</span>
          </Link>
          <div className="mt-4 border-t border-[#1e3a5f] pt-4">
            <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-[#a3c0e6] uppercase">Leaderboards</h3>
            <Link
              href={getRoute('leaderboard.strength')}
              className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
            >
              <Award className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
              <span className="group-hover:text-white">Strength</span>
            </Link>
            <Link
              href={getRoute('leaderboard.consistency')}
              className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
            >
              <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
              <span className="group-hover:text-white">Consistency</span>
            </Link>
          </div>
        </nav>
        <div className="border-t border-[#1e3a5f] p-4">
          <Link
            href={getRoute('admin.logout')}
            method="post"
            as="button"
            className="flex w-full items-center rounded-lg px-4 py-3 text-[#a3c0e6] hover:bg-[#112845] hover:text-white transition-colors"
            preserveScroll
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={toggleSidebar}></div>}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[#1e3a5f] bg-[#0a1e3c] transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#1e3a5f] px-6">
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed]">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">AthleteTrack</h1>
          </div>
          <button onClick={toggleSidebar} className="text-[#a3c0e6] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          <Link
            href={getRoute('student.dashboard')}
            className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
          >
            <Home className="mr-3 h-5 w-5 text-[#4a90e2]" />
            <span>Dashboard</span>
          </Link>
          <Link
            href={getRoute('student.training')}
            className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
          >
            <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
            <span>Training</span>
          </Link>
          <Link
            href={getRoute('student.progress')}
            className="flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white"
          >
            <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2]" />
            <span>Progress</span>
          </Link>
          <div className="mt-4 border-t border-[#1e3a5f] pt-4">
            <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-[#a3c0e6] uppercase">Leaderboards</h3>
            <Link
              href={getRoute('leaderboard.strength')}
              className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
            >
              <Award className="mr-3 h-5 w-5 text-[#4a90e2]" />
              <span>Strength</span>
            </Link>
            <Link
              href={getRoute('leaderboard.consistency')}
              className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50"
            >
              <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2]" />
              <span>Consistency</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-4 py-4 backdrop-blur-md">
          <div className="mx-auto flex items-center justify-between px-4 py-2">
            <button onClick={toggleSidebar} className="mr-4 text-[#a3c0e6] hover:text-white lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-white">Your Progress</h1>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">YOUR PROGRESS</h2>
            <p className="text-[#a3c0e6]">
              Track your improvement across all testing metrics. Each graph shows your results from the baseline testing through to your most recent assessments.
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(progressData).map(([testKey, data]) => {
              const chartData = formatChartData(data.sessions);
              return (
                <div key={testKey} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg">
                  <button
                    onClick={() => toggleTest(testKey)}
                    className="w-full flex items-center justify-between p-4 text-left focus:outline-none bg-[#0a1e3c]"
                  >
                    <h3 className="text-xl font-bold text-white">{data.name}</h3>
                    <div className="flex items-center">
                      {data.percentageIncrease !== null && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${
                          data.percentageIncrease >= 0
                            ? 'bg-green-900/40 text-green-300'
                            : 'bg-red-900/40 text-red-300'
                        }`}>
                          {data.percentageIncrease >= 0 ? '+' : ''}{data.percentageIncrease}%
                        </span>
                      )}
                      {expandedTests[testKey] ? (
                        <ChevronUp className="h-5 w-5 text-[#4a90e2]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#4a90e2]" />
                      )}
                    </div>
                  </button>

                  {expandedTests[testKey] && (
                    <div className="p-4">
                      {chartData.length === 0 ? (
                        <p className="text-center text-[#a3c0e6] py-8">No data available for this test yet.</p>
                      ) : (
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={chartData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                              <XAxis
                                dataKey="name"
                                stroke="#a3c0e6"
                                tick={{ fill: '#a3c0e6' }}
                                angle={-45}
                                textAnchor="end"
                                height={70}
                              />
                              <YAxis stroke="#a3c0e6" tick={{ fill: '#a3c0e6' }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#0a1e3c',
                                  borderColor: '#1e3a5f',
                                  color: '#fff'
                                }}
                                labelStyle={{ color: '#fff' }}
                              />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="value"
                                name={data.name}
                                stroke={testColors[testKey] || '#4a90e2'}
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {data.percentageIncrease !== null && (
                        <div className="mt-4 p-3 rounded-lg bg-[#0a1e3c]/50 border border-[#1e3a5f]">
                          <p className="text-center text-[#a3c0e6]">
                            <span className="font-bold">Overall Improvement: </span>
                            <span className={data.percentageIncrease >= 0 ? 'text-green-300' : 'text-red-300'}>
                              {data.percentageIncrease >= 0 ? '+' : ''}{data.percentageIncrease}%
                            </span>
                            {' '}from baseline to latest test
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 shadow-lg backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl justify-around">
          <Link
            href={getRoute('student.dashboard')}
            className="flex flex-col items-center px-4 py-3 text-[#a3c0e6] transition-colors hover:text-white"
          >
            <Home className="mb-1 h-6 w-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href={getRoute('student.training')}
            className="flex flex-col items-center px-4 py-3 text-[#a3c0e6] transition-colors hover:text-white"
          >
            <Activity className="mb-1 h-6 w-6" />
            <span className="text-xs">Training</span>
          </Link>
          <Link
            href={getRoute('student.progress')}
            className="flex flex-col items-center border-t-2 border-[#4a90e2] px-4 py-3 text-[#4a90e2]"
          >
            <BarChart2 className="mb-1 h-6 w-6" />
            <span className="text-xs">Progress</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Progress;
