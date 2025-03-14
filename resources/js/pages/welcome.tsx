"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import RankingSection from "@/components/ranking-section"
import type { SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import {
  Activity,
  BarChart2,
  CheckCircle,
  Medal,
  TrendingUp,
  Users,
  Dumbbell,
  LineChart,
  Trophy,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

declare global {
    interface Window {
      route: (...args: unknown[]) => string
    }
  }

export default function Welcome() {
  const { auth } = usePage<SharedData>().props
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement | null>(null)
  const heroTextRef = useRef<HTMLDivElement | null>(null)
  const heroImageRef = useRef<HTMLDivElement | null>(null)
  const featureRefs = useRef<HTMLDivElement[]>([])
  const howItWorksRef = useRef<HTMLDivElement | null>(null)
  const rankingRef = useRef<HTMLDivElement | null>(null)
  const testimonialRefs = useRef<HTMLDivElement[]>([])
  // pricingRef REMOVED (we're not using pricing anymore)
  const faqRef = useRef<HTMLDivElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)

  // State for FAQ expand/collapse
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Toggle FAQ
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  // GSAP animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Reset refs array
    featureRefs.current = []
    testimonialRefs.current = []

    // Hero section animations
    const heroTl = gsap.timeline()
    heroTl.from(heroTextRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
    heroTl.from(
      heroImageRef.current,
      {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.5"
    )

    // Features section animations
    featureRefs.current.forEach((feature, index) => {
      gsap.from(feature, {
        scrollTrigger: {
          trigger: feature,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
      })
    })

    // How it works section animation
    gsap.from(howItWorksRef.current, {
      scrollTrigger: {
        trigger: howItWorksRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })

    // Ranking section animation
    gsap.from(rankingRef.current, {
      scrollTrigger: {
        trigger: rankingRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })

    // Testimonials section animations
    testimonialRefs.current.forEach((testimonial, index) => {
      gsap.from(testimonial, {
        scrollTrigger: {
          trigger: testimonial,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: "power3.out",
      })
    })

    // FAQ section animation
    if (faqRef.current) {
      gsap.from(faqRef.current, {
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
    }

    // CTA section animation
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
    }
  }, [expandedFaq])

  // Add to feature refs
  const addToFeatureRefs = (el: HTMLDivElement | null) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el)
    }
  }

  // Add to testimonial refs
  const addToTestimonialRefs = (el: HTMLDivElement | null) => {
    if (el && !testimonialRefs.current.includes(el)) {
      testimonialRefs.current.push(el)
    }
  }

  return (
    <>
      <Head title="AthleteTrack">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="AthleteTrack - The ultimate platform for tracking athletic progress, setting goals, and achieving your potential."
        />
      </Head>

      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <span className="text-xl font-bold">AthleteTrack</span>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              <li>
                <a
                  href="#features"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#ranking"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Rankings
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Testimonials
                </a>
              </li>
              {/* Removed pricing link */}
              <li>
                <a
                  href="#faq"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            {auth.user ? (
              <Link href={window.route("dashboard")} className="text-sm font-medium text-white">
                <Button className="shadow-lg transition-all hover:shadow-blue-500/20">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link
                  href={window.route("login")}
                  className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 md:block"
                >
                  Log in
                </Link>
                <Link href={window.route("register")} className="text-sm font-medium text-white">
                  <Button className="shadow-lg transition-all hover:shadow-blue-500/20">Get Started</Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-800">
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#ranking"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rankings
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </a>
              </li>
              {/* Removed pricing link */}
              <li>
                <a
                  href="#faq"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>
              </li>
              <li>
                <Link
                  href={window.route("login")}
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-cover bg-center pt-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1517637382994-f02da38c6728?q=80&w=1974&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-black/70"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div ref={heroTextRef} className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Track Your Athletic<span className="text-blue-400"> Progress</span>
            </h1>
            <p className="mb-8 text-lg text-gray-200">
              A comprehensive platform for young athletes to track progress, compete on leaderboards, and achieve their
              strength and conditioning goals.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="h-12 px-8 shadow-lg transition-all hover:shadow-blue-500/40"
              >
                Start Training
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-white text-white hover:bg-white/10"
              >
                View Leaderboards
              </Button>
            </div>
          </div>

          {/* Hero Image (Mockup) */}
          <div ref={heroImageRef} className="mt-16 rounded-xl bg-white/10 p-2 shadow-2xl backdrop-blur-sm md:p-4">
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100/10 dark:bg-gray-800/20">
              <div className="h-full w-full bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-sm">
                {/* Dashboard Mockup */}
                <div className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                        SP
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-bold text-white">SpeedPhantom</div>
                        <div className="text-xs text-gray-300">Strength Level 5</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full bg-green-900/50 px-2 py-1 backdrop-blur-sm">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-xs font-medium text-green-300">98% Consistency</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-3 gap-4">
                    <div className="col-span-2 rounded-lg bg-white/10 p-4 shadow-md backdrop-blur-sm">
                      <div className="mb-2 font-medium text-white">Progress Overview</div>
                      <div className="flex h-40 items-center justify-center rounded-md bg-blue-900/30">
                        <LineChart className="h-24 w-24 text-blue-300 opacity-50" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex-1 rounded-lg bg-white/10 p-4 shadow-md backdrop-blur-sm">
                        <div className="mb-2 font-medium text-white">Leaderboards</div>
                        <div className="flex h-16 items-center justify-center rounded-md bg-purple-900/30">
                          <Trophy className="h-8 w-8 text-purple-300 opacity-50" />
                        </div>
                      </div>
                      <div className="flex-1 rounded-lg bg-white/10 p-4 shadow-md backdrop-blur-sm">
                        <div className="mb-2 font-medium text-white">Next Session</div>
                        <div className="flex h-16 items-center justify-center rounded-md bg-green-900/30">
                          <Dumbbell className="h-8 w-8 text-green-300 opacity-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="h-auto w-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="dark:fill-gray-900"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Features Designed for Young Athletes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to track progress, build strength, and achieve your athletic potential.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card
              ref={addToFeatureRefs}
              className="border-2 bg-white transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:bg-gray-900"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <BarChart2 className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Performance Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your progress in standing long jump, single-leg jumps, wall sits, and more.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card
              ref={addToFeatureRefs}
              className="border-2 bg-white transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:bg-gray-900"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Strength Level System
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Earn XP for completing training sessions and level up your strength profile.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card
              ref={addToFeatureRefs}
              className="border-2 bg-white transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:bg-gray-900"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                  <Medal className="h-8 w-8 text-purple-600 dark:text-purple-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Leaderboards</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Compete with other athletes on strength level and consistency leaderboards.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card
              ref={addToFeatureRefs}
              className="border-2 bg-white transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:bg-gray-900"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                  <Users className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Consistency Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor your training consistency with percentage-based scoring.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card
              ref={addToFeatureRefs}
              className="border-2 bg-white transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:bg-gray-900"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                  <Dumbbell className="h-8 w-8 text-red-600 dark:text-red-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Structured Training
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Follow a progressive, drip-fed 14-week program with repeated blocks of sessions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card
              ref={addToFeatureRefs}
              className="border-2 bg-white transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:bg-gray-900"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-teal-100 p-3 dark:bg-teal-900/30">
                  <LineChart className="h-8 w-8 text-teal-600 dark:text-teal-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Progress Visualization
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View your improvements on detailed graphs and see percentage increases over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="relative bg-cover bg-fixed bg-center py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop')",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">How AthleteTrack Works</h2>
            <p className="text-lg text-gray-300">
              A simple process to help you track and improve your athletic performance
            </p>
          </div>

          {/* STEPS (3) */}
          <div className="grid gap-8 md:grid-cols=3 md:grid-cols-3">
            <div className="relative rounded-lg bg-white/10 p-6 shadow-xl backdrop-blur-sm transition-transform hover:-translate-y-1">
              <div className="absolute -left-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                1
              </div>
              <div className="ml-6 pt-2">
                <h3 className="mb-2 text-xl font-semibold text-white">Coach Setup</h3>
                <p className="text-gray-300">
                  A coach/administrator signs you up with a unique Athlete Username (no real names under 18),
                  Parent Email, and Password. Initial test results are entered for your baseline.
                </p>
              </div>
            </div>

            <div className="relative rounded-lg bg-white/10 p-6 shadow-xl backdrop-blur-sm transition-transform hover:-translate-y-1">
              <div className="absolute -left-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                2
              </div>
              <div className="ml-6 pt-2">
                <h3 className="mb-2 text-xl font-semibold text-white">Home Page Overview</h3>
                <p className="text-gray-300">
                  Once logged in, see your Athlete Code Name, Strength Level (XP-based),
                  and Consistency Score (percentage). Access direct links to
                  Leaderboards and track your weekly Sessions or Testing on a drip feed.
                </p>
              </div>
            </div>

            <div className="relative rounded-lg bg-white/10 p-6 shadow-xl backdrop-blur-sm transition-transform hover:-translate-y-1">
              <div className="absolute -left-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                3
              </div>
              <div className="ml-6 pt-2">
                <h3 className="mb-2 text-xl font-semibold text-white">Log Training & Progress</h3>
                <p className="text-gray-300">
                  Fill out sessions as they unlock: warm-up yes/no, best scores in plyometrics, power, strength, etc.
                  Test every few weeks, track consistency, and earn XP. Then head to “Your Progress” to see
                  improvements and percentage gains over time!
                </p>
              </div>
            </div>
          </div>

          {/* APP FEATURES SUMMARY */}
<div className="mt-16 rounded-xl bg-white/10 p-6 shadow-xl backdrop-blur-sm text-white">
  {/* YouTube Tutorials Section */}
  <div className="mt-8">
    <h3 className="text-xl font-bold mb-4">🎥 Video Guides</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Tutorial 1 */}
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="rounded-lg shadow-lg"
          width="100%"
          height="250"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID_1"
          title="Getting Started with the App"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <p className="text-center mt-2 text-sm">📌 Getting Started with the App</p>
      </div>

      {/* Tutorial 2 */}
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="rounded-lg shadow-lg"
          width="100%"
          height="250"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID_2"
          title="Understanding XP & Leaderboards"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <p className="text-center mt-2 text-sm">📌 Understanding XP & Leaderboards</p>
      </div>
    </div>
  </div>
</div>

        </div>
      </section>

      {/* Ranking Section */}
      <RankingSection />

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">What Athletes Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join other young athletes who have improved their performance with AthleteTrack
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <Card
              ref={addToTestimonialRefs}
              className="overflow-hidden bg-white shadow-xl transition-all hover:shadow-2xl dark:bg-gray-800"
            >
              <div
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop')",
                }}
              ></div>
              <CardContent className="relative -mt-16 rounded-t-3xl bg-white p-6 dark:bg-gray-800">
                <div className="mb-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  "I've improved my standing long jump by 15cm in just 3 months! The leaderboards keep me motivated
                  to train consistently."
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-white font-bold">
                    JR
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">JumpRocket</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Strength Level 4</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card
              ref={addToTestimonialRefs}
              className="overflow-hidden bg-white shadow-xl transition-all hover:shadow-2xl dark:bg-gray-800"
            >
              <div
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop')",
                }}
              ></div>
              <CardContent className="relative -mt-16 rounded-t-3xl bg-white p-6 dark:bg-gray-800">
                <div className="mb-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  "The structured training program has helped me stay consistent. I'm now at the top of the
                  consistency leaderboard!"
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-green-500 text-white font-bold">
                    SP
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">SpeedPhantom</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">98% Consistency</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card
              ref={addToTestimonialRefs}
              className="overflow-hidden bg-white shadow-xl transition-all hover:shadow-2xl dark:bg-gray-800"
            >
              <div
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=2069&auto=format&fit=crop')",
                }}
              ></div>
              <CardContent className="relative -mt-16 rounded-t-3xl bg-white p-6 dark:bg-gray-800">
                <div className="mb-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  "I love seeing my progress in the graphs. My wall sit time has doubled since I started using
                  AthleteTrack!"
                </p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-purple-500 text-white font-bold">
                    PF
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">PowerFlex</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Strength Level 5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* (Pricing Section Removed) */}

      {/* FAQ Section */}
      <section id="faq" ref={faqRef} className="bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find answers to your questions about AthleteTrack
            </p>
          </div>

          <div className="mx-auto max-w-2xl space-y-4">
            {[
              {
                question: "How does AthleteTrack track my progress?",
                answer:
                  "AthleteTrack uses your logged workout data, test results (like jump distances, wall sit times), and session records to measure performance over time. It then visualizes your improvements with graphs and leaderboards.",
              },
              {
                question: "Is AthleteTrack free to use?",
                answer:
                  "Our Basic functionality can be used without cost. However, additional features or advanced analytics can be made available via a plan decided by your organization or coach.",
              },
              {
                question: "Can I cancel or change my plan anytime?",
                answer:
                  "Yes. You can upgrade, downgrade, or cancel at any time if your organization allows it. There are no hidden fees or obligations.",
              },
              {
                question: "What sports does AthleteTrack support?",
                answer:
                  "AthleteTrack is primarily focused on strength and conditioning for youth athletes. It’s flexible enough to benefit many sports by tracking foundational strength, plyometrics, and endurance metrics.",
              },
            ].map((item, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between focus:outline-none"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    } text-gray-600 dark:text-gray-400`}
                  />
                </button>
                <div
                  className={`mt-2 overflow-hidden transition-all ${
                    expandedFaq === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="relative py-20 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37, 99, 235, 0.9), rgba(29, 78, 216, 0.9)), url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2074&auto=format&fit=crop')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Start Your Athletic Journey?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
            Join other young athletes who are tracking their progress and improving their performance with AthleteTrack.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 shadow-xl transition-all hover:bg-blue-50 dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold text-white">AthleteTrack</span>
              </div>
              <p className="mb-4">
                Helping young athletes track, analyze, and improve their performance with structured training programs.
              </p>
              <div className="flex space-x-4">
                <a href="#" aria-label="Twitter" className="text-gray-400 transition-colors hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-400 transition-colors hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Features</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="transition-colors hover:text-white">
                    Performance Tracking
                  </a>
                </li>
                <li>
                  <a href="#features" className="transition-colors hover:text-white">
                    Strength Level System
                  </a>
                </li>
                <li>
                  <a href="#features" className="transition-colors hover:text-white">
                    Leaderboards
                  </a>
                </li>
                <li>
                  <a href="#features" className="transition-colors hover:text-white">
                    Progress Visualization
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Training</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#how-it-works" className="transition-colors hover:text-white">
                    Drip-Fed Blocks
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="transition-colors hover:text-white">
                    Testing Sessions
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="transition-colors hover:text-white">
                    Exercise Library
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="transition-colors hover:text-white">
                    Training Tips
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#faq" className="transition-colors hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} AthleteTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
