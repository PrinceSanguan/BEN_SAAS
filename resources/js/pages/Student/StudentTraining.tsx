import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Activity,
  Award,
  BarChart2,
  Calendar,
  Home,
  LogOut,
  Menu,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Session {
  id: number;
  session_number: number | null;
  session_type: 'training' | 'testing' | 'rest';
  is_completed: boolean;
  label: string; // Added custom display label from backend
}

interface Week {
  week_number: number;
  // Preformatted week label (e.g., "Session 1 & Session 2" or "TESTING, Session 9 & Session 10")
  label: string;
  sessions: Session[];
}

interface Block {
  id: number;
  block_number: number;
  weeks: Week[];
}

interface StudentTrainingProps {
  blocks: Block[];
  username?: string;
  routes?: { [key: string]: string };
}

const StudentTraining: React.FC<StudentTrainingProps> = ({ blocks, username = 'Athlete', routes = {} }) => {
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<{ [blockId: number]: number[] }>({});
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refs for GSAP animations
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Responsive check
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (isMobile) return;
    const tl = gsap.timeline({ delay: 0.1 });
    if (pageRef.current) {
      tl.from(pageRef.current, { opacity: 0.8, duration: 0.5, ease: 'power2.out' });
    }
    if (headerRef.current) {
      tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.2');
    }
    if (sidebarRef.current) {
      tl.from(sidebarRef.current, { x: -30, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    }
    if (mainContentRef.current) {
      tl.from(mainContentRef.current, { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    }
  }, [isMobile]);

  // Toggle dropdown for a block
  const toggleBlock = (blockId: number) => {
    setExpandedBlock(expandedBlock === blockId ? null : blockId);
  };

  // Toggle dropdown for a week within a block
  const toggleWeek = (blockId: number, weekNumber: number) => {
    setExpandedWeeks(prev => {
      const currentWeeks = prev[blockId] || [];
      if (currentWeeks.includes(weekNumber)) {
        return { ...prev, [blockId]: currentWeeks.filter(w => w !== weekNumber) };
      }
      return { ...prev, [blockId]: [...currentWeeks, weekNumber] };
    });
  };

  // Helper to generate route URLs
  const getRoute = (name: string, params?: Record<string, string | number>): string => {
    if (routes && routes[name]) return routes[name];
    if (typeof window !== 'undefined' && window.route && typeof window.route === 'function') {
      try {
        return window.route(name, params);
      } catch (e) {
        console.error('Error using window.route:', e);
      }
    }
    const fallbackRoutes: Record<string, string> = {
      'student.dashboard': '/dashboard',
      'student.training': '/training',
      'training.session.show': '/training/session', // Your route should accept a sessionId
      'leaderboard.strength': '/leaderboard/strength',
      'leaderboard.consistency': '/leaderboard/consistency',
    };
    return fallbackRoutes[name] || '#';
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Function to display session label correctly
  const getSessionDisplayLabel = (session: Session) => {
    // Use the label from backend if available
    if (session.label) return session.label;

    // Fallback logic if label is not available
    if (session.session_type === 'testing') {
      return 'TESTING';
    } else {
      return `Session ${session.session_number}`;
    }
  };

  return (
    <div ref={pageRef} className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
      <Head title="Your Training" />

      {/* Sidebar (Desktop) */}
      <div ref={sidebarRef} className="fixed z-30 hidden h-full border-r border-[#1e3a5f] bg-[#0a1e3c] lg:flex lg:w-64 lg:flex-col">
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
          <a href={getRoute('student.dashboard')} className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50">
            <Home className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
            <span className="group-hover:text-white">Dashboard</span>
          </a>
          <a href={getRoute('student.training')} className="group flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white">
            <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
            <span>Training</span>
          </a>
          <div className="mt-4 border-t border-[#1e3a5f] pt-4">
            <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-[#a3c0e6] uppercase">Leaderboards</h3>
            <a href={getRoute('leaderboard.strength')} className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50">
              <Award className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
              <span className="group-hover:text-white">Strength</span>
            </a>
            <a href={getRoute('leaderboard.consistency')} className="group flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50">
              <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2] group-hover:text-white" />
              <span className="group-hover:text-white">Consistency</span>
            </a>
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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[#1e3a5f] bg-[#0a1e3c] transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
          <a href={getRoute('student.dashboard')} className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50">
            <Home className="mr-3 h-5 w-5 text-[#4a90e2]" />
            <span>Dashboard</span>
          </a>
          <a href={getRoute('student.training')} className="flex items-center rounded-md bg-[#1e3a5f] px-4 py-3 text-white">
            <Activity className="mr-3 h-5 w-5 text-[#4a90e2]" />
            <span>Training</span>
          </a>
          <div className="mt-4 border-t border-[#1e3a5f] pt-4">
            <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-[#a3c0e6] uppercase">Leaderboards</h3>
            <a href={getRoute('leaderboard.strength')} className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50">
              <Award className="mr-3 h-5 w-5 text-[#4a90e2]" />
              <span>Strength</span>
            </a>
            <a href={getRoute('leaderboard.consistency')} className="flex items-center rounded-md px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50">
              <BarChart2 className="mr-3 h-5 w-5 text-[#4a90e2]" />
              <span>Consistency</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content: Schedule */}
      <div className="flex-1 lg:ml-64">
        <header ref={headerRef} className="sticky top-0 z-10 border-b border-[#1e3a5f] bg-[#0a1e3c]/80 px-4 py-4 backdrop-blur-md">
          <div className="mx-auto flex items-center justify-between px-4 py-2">
            <button onClick={toggleSidebar} className="mr-4 text-[#a3c0e6] hover:text-white lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-white">Your Training</h1>
          </div>
        </header>
        <main ref={mainContentRef} className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:pb-6">
          {blocks.length === 0 ? (
            <div className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] p-6 text-center shadow-lg">
              <p className="text-[#a3c0e6]">No training blocks available yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {blocks.map((block) => (
                <div key={block.id} className="overflow-hidden rounded-xl border border-[#1e3a5f] bg-[#112845] shadow-lg p-4">
                  <button onClick={() => toggleBlock(block.id)} className="w-full text-left focus:outline-none">
                    <h2 className="text-2xl font-bold text-white mb-4">Block {block.block_number}</h2>
                  </button>
                  {expandedBlock === block.id && (
                    <div className="space-y-3">
                      {block.weeks.map((week) => (
                        <div key={week.week_number} className="border-t border-gray-600 pt-2">
                          <button
                            onClick={() => toggleWeek(block.id, week.week_number)}
                            className="w-full text-left focus:outline-none"
                          >
                            <strong className="text-white">Week {week.week_number}:</strong>
                          </button>
                          {expandedWeeks[block.id] && expandedWeeks[block.id].includes(week.week_number) && (
                            <div className="ml-4 mt-1 grid grid-cols-1 gap-2">
                              {week.sessions.map((session) => (
                                <div key={session.id} className="rounded-lg border border-gray-500 bg-[#0a1e3c] p-3">
                                  {session.session_type !== 'rest' ? (
                                    <a
                                      href={getRoute('training.session.show', { sessionId: session.id })}
                                      className="block text-white underline hover:text-[#63b3ed]"
                                    >
                                      {/* Use the getSessionDisplayLabel function to show correct label */}
                                      {getSessionDisplayLabel(session)}
                                      {session.is_completed && (
                                        <span className="ml-2 inline-flex items-center rounded-full bg-green-200 px-2 py-1 text-xs font-medium text-green-700">
                                          Completed
                                        </span>
                                      )}
                                    </a>
                                  ) : (
                                    <span className="block text-white">{session.label}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 shadow-lg backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl justify-around">
          <a
            href={getRoute('student.training')}
            className="flex flex-col items-center border-t-2 border-[#4a90e2] px-4 py-3 text-[#4a90e2]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mb-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-xs">Training</span>
          </a>
          <a
            href={getRoute('student.dashboard')}
            className="flex flex-col items-center px-4 py-3 text-[#a3c0e6] transition-colors hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mb-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs">Home</span>
          </a>
        </div>
      </div>

      <style>
        {`
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @media screen and (min-width: 375px) and (max-width: 414px) {
            .max-w-md { max-width: 100%; }
            main { padding-left: 16px; padding-right: 16px; }
            button, a { min-height: 44px; }
          }
        `}
      </style>
    </div>
  );
};

export default StudentTraining;
