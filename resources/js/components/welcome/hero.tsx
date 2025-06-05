"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Play,
  Award,
  Users,
  BookOpen,
  Star,
  Activity,
  CheckCircle,
  Trophy,
  Target,
  Zap,
  Menu,
  X,
  Globe,
  Shield,
  Clock,
} from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import gsap from "gsap"

const Hero: React.FC = () => {
  const [currentBg, setCurrentBg] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  // Enhanced background images with better variety
  const backgroundImages = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1566351810-2b3c8b5b0c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ]

  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Background rotation with smoother transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Enhanced GSAP animations with stagger effects
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Enhanced entrance animations
      tl.from(titleRef.current, {
        y: 120,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
      })
        .from(
          subtitleRef.current,
          {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=1",
        )
        .from(
          ctaRef.current?.children || [],
          {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "back.out(1.4)",
          },
          "-=0.8",
        )
        .from(
          profileRef.current,
          {
            y: 80,
            opacity: 0,
            scale: 0.9,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .from(
          statsRef.current?.children || [],
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4",
        )

      // Enhanced floating animations
      gsap.to(profileRef.current, {
        y: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })

      // Parallax effect for decorative elements
      gsap.to(".floating-element", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.5,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Enhanced counter animation
  const animateCounter = useCallback((element: HTMLElement, target: number, suffix = "") => {
    gsap.to(
      { value: 0 },
      {
        value: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: function () {
          element.textContent = Math.round(this.targets()[0].value) + suffix
        },
      },
    )
  }, [])

  // Intersection observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll(".counter")
            counters.forEach((counter, index) => {
              const targets = [1000, 10, 1, 0]
              const suffixes = ["+", "+", "", ""]
              animateCounter(counter as HTMLElement, targets[index], suffixes[index])
            })
          }
        })
      },
      { threshold: 0.5 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [animateCounter])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
    // Here you would typically open a modal or navigate to video
    console.log("Playing demo video...")
  }

  return (
    <div ref={heroRef} className="relative min-h-screen flex flex-col">
      {/* Enhanced Navigation Bar */}
      <header
        className={`w-full transition-all duration-300 py-4 px-6 z-50 fixed top-0 left-0 right-0 ${
          scrollY > 50
            ? "bg-slate-900/98 backdrop-blur-lg border-b border-slate-800 shadow-2xl"
            : "bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Activity className="h-9 w-9 text-blue-500 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              </div>
              <span className="text-white font-black text-xl tracking-tight">AthleteTrack</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {["Home", "About Us", "Our Training", "Apply", "Testimonials"].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-white/80 hover:text-white text-sm font-medium transition-all hover:scale-105 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden sm:flex text-white border border-blue-500/50 hover:bg-blue-500/20 items-center gap-2 rounded-lg transition-all hover:scale-105"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-400"
              >
                <path
                  d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 17L15 12L10 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Log in
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-lg border-b border-slate-800 shadow-2xl">
            <nav className="container mx-auto px-6 py-6 space-y-4">
              {["Home", "About Us", "Our Training", "Apply", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="block text-white/80 hover:text-white text-lg font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button
                variant="outline"
                className="w-full text-white border border-blue-500/50 hover:bg-blue-500/20 mt-4"
              >
                Log in
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20"></div>

      {/* Enhanced Hero Section */}
      <main className="flex-1 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Enhanced Background Image Slider */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-3000 ease-in-out ${
                index === currentBg ? "opacity-50 scale-110" : "opacity-0 scale-100"
              }`}
              style={{
                backgroundImage: `url('${image}')`,
                filter: "brightness(0.6) contrast(1.2) saturate(1.1)",
              }}
            />
          ))}

          {/* Enhanced gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-slate-900/90 to-black/95"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.15)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.1)_0%,transparent_50%)]"></div>
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="floating-element absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/15 to-cyan-500/15 blur-3xl animate-pulse"></div>
        <div className="floating-element absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-3xl animate-pulse delay-1000"></div>
        <div className="floating-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-blue-500/8 to-purple-500/8 blur-3xl"></div>

        {/* Enhanced floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          {/* Enhanced trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Badge
              variant="secondary"
              className="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all hover:scale-105"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
              4.9/5 Rating
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all hover:scale-105"
            >
              <Trophy className="w-4 h-4 text-amber-400 mr-2" />
              Award Winning
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all hover:scale-105"
            >
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Science-Based
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all hover:scale-105"
            >
              <Shield className="w-4 h-4 text-blue-400 mr-2" />
              Zero Injuries
            </Badge>
          </div>

          <div className="max-w-6xl mx-auto text-center mb-24">
            <h1
              ref={titleRef}
              className="text-5xl md:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight"
            >
              Where Young Athletes
              <span className="block mt-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Train Smarter — Not Just Harder
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
            >
              Expert guidance that builds performance, protects against injury, and brings out the best in your child.
              <span className="block mt-3 text-blue-300 font-medium text-lg md:text-xl">
                Scientifically designed, individually delivered — and fully supported for parents.
              </span>
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
              <Button
                size="lg"
                className="h-16 px-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xl rounded-2xl w-full sm:w-auto flex items-center justify-center gap-3 group shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50"
              >
                <Zap className="h-6 w-6" />
                Start Your Journey
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 border-2 border-white/50 text-white font-bold text-xl hover:bg-white/20 hover:border-white/70 rounded-2xl w-full sm:w-auto flex items-center justify-center gap-3 backdrop-blur-sm transition-all hover:scale-105"
                onClick={handleVideoPlay}
              >
                <Play className="h-6 w-6 fill-current" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Enhanced Expert Profile Card */}
          <div ref={profileRef} className="max-w-5xl mx-auto mb-24">
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl border-2 border-amber-500/50 shadow-2xl overflow-hidden relative group hover:border-amber-500/70 transition-all">
              {/* Enhanced premium badge */}
              <div className="absolute top-8 right-8 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-sm font-black px-6 py-3 rounded-full shadow-xl z-10">
                ⭐ WORLD EXPERT
              </div>

              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-transparent to-amber-500/15 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>

              <div className="p-12">
                <div className="flex flex-col xl:flex-row items-center xl:items-start gap-12">
                  {/* Enhanced Profile Image */}
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-2 shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-amber-500/60">
                        <img
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                          alt="Dr Ben Pullen - Youth Strength Training Expert"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-3 shadow-xl">
                      <Award className="h-8 w-8 text-black" />
                    </div>
                    {/* Enhanced floating rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-pulse delay-1000"></div>
                  </div>

                  {/* Enhanced Profile Info */}
                  <div className="text-center xl:text-left flex-1">
                    <div className="flex items-center justify-center xl:justify-start gap-4 mb-3">
                      <h2 className="text-4xl md:text-5xl font-black text-white">Dr Ben Pullen</h2>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-2xl md:text-3xl text-amber-400 font-black mb-8 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                      PhD in Paediatric Strength Training
                    </p>

                    {/* Enhanced Badges */}
                    <div className="flex flex-wrap gap-4 justify-center xl:justify-start mb-8">
                      <Badge className="bg-amber-500/25 text-amber-300 px-6 py-3 rounded-full text-base font-bold border border-amber-500/50 shadow-lg hover:bg-amber-500/30 transition-all">
                        <Trophy className="h-5 w-5 mr-2" />
                        Youth Expert
                      </Badge>
                      <Badge className="bg-blue-500/25 text-blue-300 px-6 py-3 rounded-full text-base font-bold border border-blue-500/50 shadow-lg hover:bg-blue-500/30 transition-all">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Researcher
                      </Badge>
                      <Badge className="bg-green-500/25 text-green-300 px-6 py-3 rounded-full text-base font-bold border border-green-500/50 shadow-lg hover:bg-green-500/30 transition-all">
                        <Globe className="h-5 w-5 mr-2" />
                        Published Author
                      </Badge>
                    </div>

                    <p className="text-gray-300 text-lg mb-8 flex items-center justify-center xl:justify-start gap-3">
                      <Target className="h-6 w-6 text-amber-500" />
                      Leading Youth Strength & Conditioning Expert Worldwide
                    </p>
                  </div>
                </div>

                {/* Enhanced Stats Row */}
                <div
                  ref={statsRef}
                  className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 border-t border-slate-700/50 pt-10"
                >
                  <div className="text-center group">
                    <div className="counter text-3xl md:text-4xl font-black text-amber-500 mb-2 transition-transform group-hover:scale-110">
                      1000+
                    </div>
                    <div className="text-base text-gray-400 font-medium">Athletes Trained</div>
                  </div>
                  <div className="text-center group">
                    <div className="counter text-3xl md:text-4xl font-black text-blue-500 mb-2 transition-transform group-hover:scale-110">
                      10+
                    </div>
                    <div className="text-base text-gray-400 font-medium">Years Experience</div>
                  </div>
                  <div className="text-center group">
                    <div className="counter text-3xl md:text-4xl font-black text-purple-500 mb-2 transition-transform group-hover:scale-110">
                      PhD
                    </div>
                    <div className="text-base text-gray-400 font-medium">Qualified</div>
                  </div>
                  <div className="text-center group">
                    <div className="counter text-3xl md:text-4xl font-black text-green-500 mb-2 transition-transform group-hover:scale-110">
                      0
                    </div>
                    <div className="text-base text-gray-400 font-medium">Injuries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50 flex items-start gap-8 hover:bg-slate-800/90 transition-all hover:scale-105 shadow-xl group">
              <div className="rounded-full bg-purple-900/60 p-5 flex-shrink-0 group-hover:bg-purple-900/80 transition-all">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">10+ Years Excellence</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Coaching 1000+ youth athletes with proven results, innovative methodologies, and a track record of
                  developing champions across multiple sports.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50 flex items-start gap-8 hover:bg-slate-800/90 transition-all hover:scale-105 shadow-xl group">
              <div className="rounded-full bg-green-900/60 p-5 flex-shrink-0 group-hover:bg-green-900/80 transition-all">
                <BookOpen className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Research Leader</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Published youth strength & conditioning researcher with peer-reviewed studies shaping the future of
                  athletic development worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    A Coaching Experience Your Child Will Love
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
                  Our programme is more than reps and drills — it's a creative, positive environment where young
                  athletes feel supported, challenged, and excited to train. Every session is engaging, novel, and
                  focused — because when training is fun, commitment comes naturally.
                </p>
              </div>

              {/* Enhanced feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Target className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Personalized</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Tailored programs designed for each athlete's unique needs, goals, and developmental stage
                  </p>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <CheckCircle className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Safe & Effective</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Evidence-based methods with our proven zero injury record across thousands of training sessions
                  </p>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Star className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Results Driven</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Proven track record of athletic development with measurable improvements in strength and performance
                  </p>
                </div>
              </div>

              {/* Additional trust elements */}
              <div className="mt-12 pt-8 border-t border-slate-700/50">
                <div className="flex flex-wrap justify-center gap-8 items-center">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="font-medium">Flexible Scheduling</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="font-medium">Fully Insured</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Award className="h-5 w-5 text-amber-400" />
                    <span className="font-medium">Certified Professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Hero
