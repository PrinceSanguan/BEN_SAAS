"use client"

import { Link, router } from "@inertiajs/react"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import {
  Home,
  Activity,
  Trophy,
  Settings,
  Dumbbell,
  BarChart2,
  Calendar,
  Clock,
  ChevronRight,
  User,
  Award,
  TrendingUp,
  ChevronUp,
  Bell,
  Menu,
  X,
  LogOut,
  HelpCircle,
  FileText,
} from "lucide-react"

// TypeScript interface for component props
interface StudentDashboardProps {
  username: string
  strengthLevel: number
  consistencyScore: number
  blocks: Array<{
    id: number
    block_number: number
    start_date: string
    end_date: string
    duration_weeks: number
    is_current: boolean
  }>
  routes?: {
    [key: string]: string
  }
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  username,
  strengthLevel,
  consistencyScore,
  blocks = [], // Provide default empty array to prevent issues
  routes = {}, // Default to empty object if routes is not provided
}) => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<{
    id: number
    block_number: number
    start_date: string
    end_date: string
    duration_weeks: number
    is_current: boolean
  } | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Debug routes in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Routes received:", routes)
    }
  }, [routes])

  // Check if using mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Use hardcoded fallback routes if not provided in props
  const getRoute = (name: string): string => {
    // Check if routes object exists and contains the route
    if (routes && routes[name]) {
      return routes[name]
    }

    // Check if window.route function is available (Ziggy)
    if (typeof window !== "undefined" && window.route && typeof window.route === "function") {
      try {
        return window.route(name)
      } catch (e) {
        console.error("Error using window.route:", e)
      }
    }

    // Fallback routes
    const fallbackRoutes: Record<string, string> = {
      "student.dashboard": "/dashboard",
      "student.training": "/training",
      "student.progress": "/progress",
      "student.settings": "/settings",
      "leaderboard.strength": "/leaderboard/strength",
      "leaderboard.consistency": "/leaderboard/consistency",
    }

    return fallbackRoutes[name] || "#"
  }

  // Refs for GSAP animations
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const strengthRef = useRef<HTMLDivElement>(null)
  const consistencyRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // GSAP animations
  useEffect(() => {
    // Skip animations on mobile
    if (isMobile) return

    // Use a short timeout to ensure DOM is fully ready
    const animationTimeout = setTimeout(() => {
      const tl = gsap.timeline()

      // Page fade in
      if (pageRef.current) {
        tl.from(pageRef.current, {
          opacity: 0.8,
          duration: 0.5,
          ease: "power2.out",
        })
      }

      // Header animation
      if (headerRef.current) {
        tl.from(
          headerRef.current,
          {
            y: -20,
            opacity: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        )
      }

      // Sidebar animation
      if (sidebarRef.current) {
        tl.from(
          sidebarRef.current,
          {
            x: -30,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2",
        )
      }

      // Main content animation
      if (mainContentRef.current) {
        tl.from(
          mainContentRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2",
        )
      }

      // Progress bars animation
      if (strengthRef.current && consistencyRef.current) {
        tl.from(
          [strengthRef.current, consistencyRef.current],
          {
            width: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.inOut",
          },
          "-=0.1",
        )
      }
    }, 100)

    return () => {
      clearTimeout(animationTimeout)
    }
  }, [isMobile])

  // Function to handle block click - Show the modal
  const handleBlockClick = (block: {
    id: number
    block_number: number
    start_date: string
    end_date: string
    duration_weeks: number
    is_current: boolean
  }) => {
    setSelectedBlock(block)
    setShowPrompt(true)
  }

  const closePrompt = () => {
    setShowPrompt(false)
    setSelectedBlock(null)
  }

  const goToTraining = () => {
    // Safe navigation with fallback
    const trainingUrl = getRoute("student.training")
    router.visit(trainingUrl)
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get current block if any
  const currentBlock = blocks.find((block) => block.is_current)

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Render mobile layout
  if (isMobile) {
    return (
      <div
        ref={pageRef}
        className="min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a] pb-20"
        style={{ backgroundColor: "#07152b" }}
      >
        {/* Header */}
        <header
          ref={headerRef}
          className="sticky top-0 z-10 bg-[#0a1e3c]/80 backdrop-blur-md border-b border-[#1e3a5f] px-4 py-4"
        >
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed] mr-3">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">AthleteTrack</h1>
            </div>
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                <User className="h-5 w-5 text-[#4a90e2]" />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          {/* Profile Card */}
          <div ref={profileRef} className="mb-6 rounded-xl bg-[#112845] p-5 border border-[#1e3a5f] shadow-lg">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1e3a5f] mr-4">
                <Award className="h-6 w-6 text-[#4a90e2]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{username}</h2>
                <p className="text-sm text-[#a3c0e6]">Athlete</p>
              </div>
              {currentBlock && (
                <div className="ml-auto rounded-lg bg-[#1e3a5f]/50 px-3 py-1.5 flex items-center">
                  <Calendar className="h-4 w-4 text-[#4a90e2] mr-2" />
                  <span className="text-xs text-[#a3c0e6]">Block {currentBlock.block_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div ref={statsRef} className="grid grid-cols-1 gap-4 mb-6">
            {/* Strength Level Card */}
            <div className="rounded-xl bg-[#0a1e3c] p-5 border border-[#1e3a5f] shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#4a90e2] uppercase tracking-wider">Strength Level</h3>
                <span className="rounded-full bg-[#1e3a5f] px-2.5 py-1 text-xs font-semibold text-[#63b3ed]">
                  XP Based
                </span>
              </div>
              <div className="flex items-center mb-2">
                <Dumbbell className="h-5 w-5 text-[#4a90e2] mr-2" />
                <p className="text-2xl font-bold text-white">{strengthLevel}</p>
                <span className="ml-2 text-xs text-[#a3c0e6]">/ 5</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#1e3a5f] overflow-hidden">
                <div
                  ref={strengthRef}
                  className="h-3 rounded-full bg-gradient-to-r from-[#4a90e2] to-[#63b3ed]"
                  style={{ width: `${(strengthLevel / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Consistency Score Card */}
            <div className="rounded-xl bg-[#0a1e3c] p-5 border border-[#1e3a5f] shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#4a90e2] uppercase tracking-wider">Consistency Score</h3>
                <span className="text-xs text-[#a3c0e6]">Based on sessions</span>
              </div>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-[#4a90e2] mr-2" />
                <p className="text-2xl font-bold text-white">{consistencyScore}%</p>
              </div>
              <div className="h-3 w-full rounded-full bg-[#1e3a5f] overflow-hidden">
                <div
                  ref={consistencyRef}
                  className="h-3 rounded-full bg-gradient-to-r from-[#63b3ed] to-[#4a90e2]"
                  style={{ width: `${consistencyScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {/* Training Button */}
              <button
                onClick={goToTraining}
                className="w-full rounded-xl bg-gradient-to-r from-[#4a90e2] to-[#63b3ed] p-5 text-left shadow-lg transition-all duration-300 hover:shadow-xl hover:from-[#3a80d2] hover:to-[#53a3dd] focus:ring-2 focus:ring-[#4a90e2] focus:ring-offset-2 focus:ring-offset-[#112845] focus:outline-none group"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mr-3">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Training Sessions</h3>
                    <p className="text-sm text-white/80">View your workout plan</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </button>

              {/* Strength Leaderboard */}
              <Link
                href={getRoute("leaderboard.strength")}
                className="block w-full rounded-xl bg-[#2563eb] p-5 text-left shadow-lg transition-all duration-300 hover:bg-[#1d4ed8] hover:shadow-xl focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:ring-offset-[#112845] focus:outline-none group"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mr-3">
                    <Dumbbell className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Strength Leaderboard</h3>
                    <p className="text-sm text-white/80">Compare your strength</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Consistency Leaderboard */}
              <Link
                href={getRoute("leaderboard.consistency")}
                className="block w-full rounded-xl bg-[#7c3aed] p-5 text-left shadow-lg transition-all duration-300 hover:bg-[#6d28d9] hover:shadow-xl focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2 focus:ring-offset-[#112845] focus:outline-none group"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mr-3">
                    <BarChart2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Consistency Leaderboard</h3>
                    <p className="text-sm text-white/80">Track your dedication</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>

          {/* Training Blocks Section */}
          {blocks && blocks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Training Blocks</h2>
                <button
                  onClick={goToTraining}
                  className="text-sm text-[#4a90e2] hover:text-[#63b3ed] transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {blocks.slice(0, 2).map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block)}
                    className={`w-full rounded-xl p-4 text-left border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:ring-offset-2 focus:ring-offset-[#112845] ${
                      block.is_current
                        ? "bg-[#1e3a5f]/50 border-[#4a90e2]"
                        : "bg-[#112845] border-[#1e3a5f] hover:bg-[#1a3456]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 ${
                            block.is_current ? "bg-[#4a90e2]/20" : "bg-[#1e3a5f]"
                          }`}
                        >
                          <Calendar className={`h-5 w-5 ${block.is_current ? "text-[#4a90e2]" : "text-[#a3c0e6]"}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Block {block.block_number}</h3>
                          <div className="flex items-center text-sm text-[#a3c0e6]">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{block.duration_weeks} weeks</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#a3c0e6]">
                          {formatDate(block.start_date)} - {formatDate(block.end_date)}
                        </div>
                        {block.is_current && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-[#4a90e2]/20 text-[#4a90e2]">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl bg-[#112845] p-4 shadow-lg border border-[#1e3a5f] transition-transform duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-[#a3c0e6]">Your Rank</h3>
                <div className="rounded-full bg-[#1e3a5f] p-1.5">
                  <Trophy className="h-4 w-4 text-[#4a90e2]" />
                </div>
              </div>
              <p className="text-xl font-bold text-white">12</p>
              <div className="mt-1 flex items-center text-xs text-[#63b3ed]">
                <ChevronUp className="h-3 w-3 mr-1" />
                <span>Up 3 places</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#112845] p-4 shadow-lg border border-[#1e3a5f] transition-transform duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-[#a3c0e6]">Sessions</h3>
                <div className="rounded-full bg-[#1e3a5f] p-1.5">
                  <Activity className="h-4 w-4 text-[#4a90e2]" />
                </div>
              </div>
              <p className="text-xl font-bold text-white">24</p>
              <div className="mt-1 flex items-center text-xs text-[#63b3ed]">
                <ChevronUp className="h-3 w-3 mr-1" />
                <span>+2 this week</span>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <div
          ref={navRef}
          className="fixed right-0 bottom-0 left-0 border-t border-[#1e3a5f] bg-[#0a1e3c]/90 backdrop-blur-md shadow-lg z-20"
        >
          <div className="max-w-md mx-auto flex justify-around">
            <a
              href={getRoute("student.dashboard")}
              className="flex flex-col items-center py-3 px-4 text-[#4a90e2] border-t-2 border-[#4a90e2]"
            >
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs">Home</span>
            </a>
            <a
              href={getRoute("student.training")}
              className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
            >
              <Activity className="h-6 w-6 mb-1" />
              <span className="text-xs">Training</span>
            </a>
            <a
              href={getRoute("student.progress")}
              className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
            >
              <Trophy className="h-6 w-6 mb-1" />
              <span className="text-xs">Progress</span>
            </a>
            <a
              href={getRoute("student.settings")}
              className="flex flex-col items-center py-3 px-4 text-[#a3c0e6] hover:text-white transition-colors"
            >
              <Settings className="h-6 w-6 mb-1" />
              <span className="text-xs">Settings</span>
            </a>
          </div>
        </div>

        {/* Modal for block selection */}
        {showPrompt && selectedBlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div
              className="w-full max-w-md rounded-xl bg-[#112845] p-6 shadow-xl border border-[#1e3a5f]"
              style={{
                animation: "scale-in 0.2s ease-out forwards",
              }}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e3a5f] mr-3">
                  <Calendar className="h-5 w-5 text-[#4a90e2]" />
                </div>
                <h3 className="text-lg font-medium text-white">Block {selectedBlock.block_number}</h3>
                {selectedBlock.is_current && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-[#4a90e2]/20 text-[#4a90e2]">
                    Current
                  </span>
                )}
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-[#4a90e2] mr-2" />
                  <p className="text-[#a3c0e6]">
                    {selectedBlock.duration_weeks} week{selectedBlock.duration_weeks !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-[#4a90e2] mr-2" />
                  <p className="text-[#a3c0e6]">
                    {new Date(selectedBlock.start_date).toLocaleDateString()} -{" "}
                    {new Date(selectedBlock.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={closePrompt}
                  className="rounded-lg border border-[#1e3a5f] bg-transparent px-4 py-2.5 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f] order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={goToTraining}
                  className="rounded-lg bg-[#4a90e2] px-4 py-2.5 text-white transition-colors hover:bg-[#3a80d2] order-1 sm:order-2"
                >
                  View Training
                </button>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
            @keyframes scale-in {
              from {
                transform: scale(0.95);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }

            @media screen and (min-width: 375px) and (max-width: 414px) {
              /* iPhone XR specific optimizations */
              .max-w-md {
                max-width: 100%;
              }

              /* Adjust padding for iPhone XR */
              main {
                padding-left: 16px;
                padding-right: 16px;
              }

              /* Make buttons more touch-friendly */
              button, a {
                min-height: 44px;
              }
            }
          `}
        </style>
      </div>
    )
  }

  // Render desktop layout
  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a] flex">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="hidden lg:flex lg:flex-col lg:w-64 bg-[#0a1e3c] border-r border-[#1e3a5f] fixed h-full z-30"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-[#1e3a5f]">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed] mr-3">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">AthleteTrack</h1>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-[#4a90e2]" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">{username}</h2>
              <p className="text-xs text-[#a3c0e6]">Athlete</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <a
            href={getRoute("student.dashboard")}
            className="flex items-center px-4 py-3 text-white bg-[#1e3a5f] rounded-md group"
          >
            <Home className="h-5 w-5 mr-3 text-[#4a90e2]" />
            <span>Dashboard</span>
          </a>
          <a
            href={getRoute("student.training")}
            className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md group transition-colors"
          >
            <Activity className="h-5 w-5 mr-3 text-[#4a90e2] group-hover:text-white" />
            <span className="group-hover:text-white">Training</span>
          </a>
          <a
            href={getRoute("student.progress")}
            className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md group transition-colors"
          >
            <Trophy className="h-5 w-5 mr-3 text-[#4a90e2] group-hover:text-white" />
            <span className="group-hover:text-white">Progress</span>
          </a>
          <a
            href={getRoute("student.settings")}
            className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md group transition-colors"
          >
            <Settings className="h-5 w-5 mr-3 text-[#4a90e2] group-hover:text-white" />
            <span className="group-hover:text-white">Settings</span>
          </a>

          <div className="pt-4 mt-4 border-t border-[#1e3a5f]">
            <h3 className="px-4 text-xs font-semibold text-[#a3c0e6] uppercase tracking-wider mb-2">Leaderboards</h3>
            <a
              href={getRoute("leaderboard.strength")}
              className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md group transition-colors"
            >
              <Dumbbell className="h-5 w-5 mr-3 text-[#4a90e2] group-hover:text-white" />
              <span className="group-hover:text-white">Strength</span>
            </a>
            <a
              href={getRoute("leaderboard.consistency")}
              className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md group transition-colors"
            >
              <BarChart2 className="h-5 w-5 mr-3 text-[#4a90e2] group-hover:text-white" />
              <span className="group-hover:text-white">Consistency</span>
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e3a5f]">
          <a href="#" className="flex items-center px-4 py-2 text-[#a3c0e6] hover:text-white transition-colors">
            <LogOut className="h-5 w-5 mr-3 text-[#4a90e2]" />
            <span>Logout</span>
          </a>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={toggleSidebar}></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#0a1e3c] border-r border-[#1e3a5f] transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#1e3a5f]">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#4a90e2] to-[#63b3ed] mr-2">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">AthleteTrack</h1>
          </div>
          <button onClick={toggleSidebar} className="text-[#a3c0e6] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <a
            href={getRoute("student.dashboard")}
            className="flex items-center px-4 py-3 text-white bg-[#1e3a5f] rounded-md"
          >
            <Home className="h-5 w-5 mr-3 text-[#4a90e2]" />
            <span>Dashboard</span>
          </a>
          <a
            href={getRoute("student.training")}
            className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md"
          >
            <Activity className="h-5 w-5 mr-3 text-[#4a90e2]" />
            <span>Training</span>
          </a>
          <a
            href={getRoute("student.progress")}
            className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md"
          >
            <Trophy className="h-5 w-5 mr-3 text-[#4a90e2]" />
            <span>Progress</span>
          </a>
          <a
            href={getRoute("student.settings")}
            className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md"
          >
            <Settings className="h-5 w-5 mr-3 text-[#4a90e2]" />
            <span>Settings</span>
          </a>

          <div className="pt-4 mt-4 border-t border-[#1e3a5f]">
            <h3 className="px-4 text-xs font-semibold text-[#a3c0e6] uppercase tracking-wider mb-2">Leaderboards</h3>
            <a
              href={getRoute("leaderboard.strength")}
              className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md"
            >
              <Dumbbell className="h-5 w-5 mr-3 text-[#4a90e2]" />
              <span>Strength</span>
            </a>
            <a
              href={getRoute("leaderboard.consistency")}
              className="flex items-center px-4 py-3 text-[#a3c0e6] hover:bg-[#1e3a5f]/50 rounded-md"
            >
              <BarChart2 className="h-5 w-5 mr-3 text-[#4a90e2]" />
              <span>Consistency</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header
          ref={headerRef}
          className="sticky top-0 z-10 bg-[#0a1e3c]/80 backdrop-blur-md border-b border-[#1e3a5f] px-6 py-4"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="lg:hidden text-[#a3c0e6] hover:text-white mr-4">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-[#a3c0e6] hover:text-white relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </button>
              <button className="text-[#a3c0e6] hover:text-white">
                <HelpCircle className="h-5 w-5" />
              </button>
              <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                <User className="h-5 w-5 text-[#4a90e2]" />
              </div>
            </div>
          </div>
        </header>

        <main ref={mainContentRef} className="px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {username}</h2>
            <p className="text-[#a3c0e6]">Here's an overview of your training progress</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Strength Level Card */}
            <div className="rounded-xl bg-[#0a1e3c] p-6 border border-[#1e3a5f] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#4a90e2] uppercase tracking-wider">Strength Level</h3>
                <span className="rounded-full bg-[#1e3a5f] px-2.5 py-1 text-xs font-semibold text-[#63b3ed]">
                  XP Based
                </span>
              </div>
              <div className="flex items-center mb-3">
                <Dumbbell className="h-6 w-6 text-[#4a90e2] mr-3" />
                <p className="text-3xl font-bold text-white">{strengthLevel}</p>
                <span className="ml-2 text-sm text-[#a3c0e6]">/ 5</span>
              </div>
              <div className="h-4 w-full rounded-full bg-[#1e3a5f] overflow-hidden mb-2">
                <div
                  ref={strengthRef}
                  className="h-4 rounded-full bg-gradient-to-r from-[#4a90e2] to-[#63b3ed]"
                  style={{ width: `${(strengthLevel / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-[#a3c0e6]">You're making great progress! Keep up the good work.</p>
            </div>

            {/* Consistency Score Card */}
            <div className="rounded-xl bg-[#0a1e3c] p-6 border border-[#1e3a5f] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#4a90e2] uppercase tracking-wider">Consistency Score</h3>
                <span className="text-xs text-[#a3c0e6]">Based on sessions</span>
              </div>
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-[#4a90e2] mr-3" />
                <p className="text-3xl font-bold text-white">{consistencyScore}%</p>
              </div>
              <div className="h-4 w-full rounded-full bg-[#1e3a5f] overflow-hidden mb-2">
                <div
                  ref={consistencyRef}
                  className="h-4 rounded-full bg-gradient-to-r from-[#63b3ed] to-[#4a90e2]"
                  style={{ width: `${consistencyScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-[#a3c0e6]">Your consistency has improved by 5% this month.</p>
            </div>
          </div>

          {/* Quick Actions and Training Blocks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={goToTraining}
                  className="w-full rounded-xl bg-gradient-to-r from-[#4a90e2] to-[#63b3ed] p-4 text-left shadow-lg transition-all duration-300 hover:shadow-xl hover:from-[#3a80d2] hover:to-[#53a3dd] focus:ring-2 focus:ring-[#4a90e2] focus:ring-offset-2 focus:ring-offset-[#112845] focus:outline-none group"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mr-3">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">Training Sessions</h3>
                      <p className="text-sm text-white/80">View your workout plan</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </button>

                <Link
                  href={getRoute("leaderboard.strength")}
                  className="block w-full rounded-xl bg-[#2563eb] p-4 text-left shadow-lg transition-all duration-300 hover:bg-[#1d4ed8] hover:shadow-xl focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:ring-offset-[#112845] focus:outline-none group"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mr-3">
                      <Dumbbell className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">Strength Leaderboard</h3>
                      <p className="text-sm text-white/80">Compare your strength</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link
                  href={getRoute("leaderboard.consistency")}
                  className="block w-full rounded-xl bg-[#7c3aed] p-4 text-left shadow-lg transition-all duration-300 hover:bg-[#6d28d9] hover:shadow-xl focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2 focus:ring-offset-[#112845] focus:outline-none group"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mr-3">
                      <BarChart2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">Consistency Leaderboard</h3>
                      <p className="text-sm text-white/80">Track your dedication</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Training Blocks */}
            <div className="lg:col-span-2">
              {blocks && blocks.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Training Blocks</h2>
                    <button
                      onClick={goToTraining}
                      className="text-sm text-[#4a90e2] hover:text-[#63b3ed] transition-colors"
                    >
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blocks.map((block) => (
                      <button
                        key={block.id}
                        onClick={() => handleBlockClick(block)}
                        className={`w-full rounded-xl p-4 text-left border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:ring-offset-2 focus:ring-offset-[#112845] ${
                          block.is_current
                            ? "bg-[#1e3a5f]/50 border-[#4a90e2]"
                            : "bg-[#112845] border-[#1e3a5f] hover:bg-[#1a3456]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 ${
                                block.is_current ? "bg-[#4a90e2]/20" : "bg-[#1e3a5f]"
                              }`}
                            >
                              <Calendar
                                className={`h-5 w-5 ${block.is_current ? "text-[#4a90e2]" : "text-[#a3c0e6]"}`}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">Block {block.block_number}</h3>
                              <div className="flex items-center text-sm text-[#a3c0e6]">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{block.duration_weeks} weeks</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-[#a3c0e6]">
                              {formatDate(block.start_date)} - {formatDate(block.end_date)}
                            </div>
                            {block.is_current && (
                              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-[#4a90e2]/20 text-[#4a90e2]">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-xl bg-[#112845] p-6 border border-[#1e3a5f] text-center">
                  <Calendar className="h-12 w-12 text-[#1e3a5f] mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-white mb-2">No Training Blocks</h3>
                  <p className="text-[#a3c0e6] mb-4">You don't have any training blocks assigned yet.</p>
                  <button
                    onClick={goToTraining}
                    className="inline-flex items-center px-4 py-2 bg-[#4a90e2] text-white rounded-md hover:bg-[#3a80d2] transition-colors"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    View Training
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl bg-[#112845] p-5 shadow-lg border border-[#1e3a5f] transition-transform duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[#a3c0e6]">Your Rank</h3>
                <div className="rounded-full bg-[#1e3a5f] p-2">
                  <Trophy className="h-5 w-5 text-[#4a90e2]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">12</p>
              <div className="mt-2 flex items-center text-xs text-[#63b3ed]">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>Up 3 places from last week</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#112845] p-5 shadow-lg border border-[#1e3a5f] transition-transform duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[#a3c0e6]">Sessions</h3>
                <div className="rounded-full bg-[#1e3a5f] p-2">
                  <Activity className="h-5 w-5 text-[#4a90e2]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">24</p>
              <div className="mt-2 flex items-center text-xs text-[#63b3ed]">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>+2 this week</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#112845] p-5 shadow-lg border border-[#1e3a5f] transition-transform duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[#a3c0e6]">Next Goal</h3>
                <div className="rounded-full bg-[#1e3a5f] p-2">
                  <Award className="h-5 w-5 text-[#4a90e2]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">Top 10</p>
              <div className="mt-2 flex items-center text-xs text-[#63b3ed]">
                <span>Keep training to reach your goal!</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#112845] p-5 shadow-lg border border-[#1e3a5f] transition-transform duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[#a3c0e6]">Upcoming</h3>
                <div className="rounded-full bg-[#1e3a5f] p-2">
                  <Calendar className="h-5 w-5 text-[#4a90e2]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">2 Days</p>
              <div className="mt-2 flex items-center text-xs text-[#63b3ed]">
                <span>Until your next training session</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-[#112845] p-6 border border-[#1e3a5f] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <button className="text-sm text-[#4a90e2] hover:text-[#63b3ed] transition-colors">View all</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a5f] mr-3 mt-1">
                  <Activity className="h-4 w-4 text-[#4a90e2]" />
                </div>
                <div>
                  <p className="text-white">
                    Completed <span className="font-medium">Strength Training Session</span>
                  </p>
                  <p className="text-sm text-[#a3c0e6]">Yesterday at 4:30 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a5f] mr-3 mt-1">
                  <Trophy className="h-4 w-4 text-[#4a90e2]" />
                </div>
                <div>
                  <p className="text-white">
                    Achieved <span className="font-medium">New Personal Best</span> in Bench Press
                  </p>
                  <p className="text-sm text-[#a3c0e6]">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a5f] mr-3 mt-1">
                  <FileText className="h-4 w-4 text-[#4a90e2]" />
                </div>
                <div>
                  <p className="text-white">
                    Updated <span className="font-medium">Training Plan</span> for Block{" "}
                    {currentBlock?.block_number || 1}
                  </p>
                  <p className="text-sm text-[#a3c0e6]">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for block selection */}
      {showPrompt && selectedBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-xl bg-[#112845] p-6 shadow-xl border border-[#1e3a5f]"
            style={{
              animation: "scale-in 0.2s ease-out forwards",
            }}
          >
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e3a5f] mr-3">
                <Calendar className="h-5 w-5 text-[#4a90e2]" />
              </div>
              <h3 className="text-lg font-medium text-white">Block {selectedBlock.block_number}</h3>
              {selectedBlock.is_current && (
                <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-[#4a90e2]/20 text-[#4a90e2]">
                  Current
                </span>
              )}
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-[#4a90e2] mr-2" />
                <p className="text-[#a3c0e6]">
                  {selectedBlock.duration_weeks} week{selectedBlock.duration_weeks !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-[#4a90e2] mr-2" />
                <p className="text-[#a3c0e6]">
                  {new Date(selectedBlock.start_date).toLocaleDateString()} -{" "}
                  {new Date(selectedBlock.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closePrompt}
                className="rounded-lg border border-[#1e3a5f] bg-transparent px-4 py-2.5 text-[#a3c0e6] transition-colors hover:bg-[#1e3a5f] order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={goToTraining}
                className="rounded-lg bg-[#4a90e2] px-4 py-2.5 text-white transition-colors hover:bg-[#3a80d2] order-1 sm:order-2"
              >
                View Training
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes scale-in {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @media screen and (min-width: 375px) and (max-width: 414px) {
            /* iPhone XR specific optimizations */
            .max-w-md {
              max-width: 100%;
            }

            /* Adjust padding for iPhone XR */
            main {
              padding-left: 16px;
              padding-right: 16px;
            }

            /* Make buttons more touch-friendly */
            button, a {
              min-height: 44px;
            }
          }
        `}
      </style>
    </div>
  )
}

export default StudentDashboard

