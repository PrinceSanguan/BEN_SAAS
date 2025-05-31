"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Award, Users, BookOpen, Star, Activity, CheckCircle, Trophy, Target, Zap } from 'lucide-react'
import { useEffect, useState, useRef } from "react"
import gsap from "gsap"

const Hero: React.FC = () => {
  const [currentBg, setCurrentBg] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Premium athletic background images from Unsplash
  const backgroundImages = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Athletic training
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Youth sports
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Team training
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"  // Athletic performance
  ]

  // Background rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgroundImages.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Hero title animation with split text effect
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .from(ctaRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .from(profileRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4")

      // Floating animation for profile card
      gsap.to(profileRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="relative min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 py-4 px-6 z-50 fixed top-0 left-0 right-0">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <span className="text-white font-bold text-xl">AthleteTrack</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Home
            </a>
            <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              About Us
            </a>
            <a href="#training" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Our Training
            </a>
            <a href="#apply" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Apply
            </a>
            <a href="#testimonials" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Testimonials
            </a>
          </nav>

          <div>
            <a href={typeof window !== 'undefined' ? window.route('login') : '#'}>
              <Button
                variant="outline"
                className="text-white border border-blue-500/50 hover:bg-blue-500/20 flex items-center gap-1.5 rounded-lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Log in
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-16"></div>

      {/* Enhanced Hero Section */}
      <main className="flex-1 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Premium Background Image Slider */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-2000 ease-in-out ${
                index === currentBg ? "opacity-40 scale-105" : "opacity-0 scale-100"
              }`}
              style={{
                backgroundImage: `url('${image}')`,
                filter: "brightness(0.7) contrast(1.1)"
              }}
            />
          ))}

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/85 to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm font-medium">Award Winning</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm font-medium">Science-Based</span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto text-center mb-20">
            <h1
              ref={titleRef}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight"
            >
              Where Young Athletes
              <span className="block mt-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                Train Smarter — Not Just Harder
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            >
              Expert guidance that builds performance, protects against injury, and brings out the best in your child.
              <span className="block mt-2 text-blue-300 font-medium">
                Scientifically designed, individually delivered — and fully supported for parents.
              </span>
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Button
                size="lg"
                className="h-14 px-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl w-full sm:w-auto flex items-center justify-center gap-3 group shadow-2xl shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40"
              >
                <Zap className="h-5 w-5" />
                Start Your Journey
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 border-2 border-white/40 text-white font-bold text-lg hover:bg-white/15 hover:border-white/60 rounded-xl w-full sm:w-auto flex items-center justify-center gap-3 backdrop-blur-sm transition-all hover:scale-105"
              >
                <Play className="h-5 w-5 fill-current" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Enhanced Expert Profile Card */}
          <div ref={profileRef} className="max-w-4xl mx-auto mb-20">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border-2 border-amber-500/40 shadow-2xl overflow-hidden relative">
              {/* Premium badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                ⭐ EXPERT
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 animate-pulse"></div>

              <div className="p-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
                  {/* Enhanced Profile Image */}
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-1.5 shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-amber-500/50">
                        <img
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                          alt="Dr Ben Pullen"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-2 shadow-lg">
                      <Award className="h-6 w-6 text-black" />
                    </div>
                    {/* Floating ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping"></div>
                  </div>

                  {/* Enhanced Profile Info */}
                  <div className="text-center lg:text-left flex-1">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                      <h2 className="text-3xl md:text-4xl font-black text-white">Dr Ben Pullen</h2>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xl md:text-2xl text-amber-400 font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                      PhD in Paediatric Strength Training
                    </p>

                    {/* Enhanced Badges */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                      <span className="bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-bold border border-amber-500/40 flex items-center gap-2 shadow-lg">
                        <Trophy className="h-4 w-4" />
                        Youth Expert
                      </span>
                      <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/40 flex items-center gap-2 shadow-lg">
                        <BookOpen className="h-4 w-4" />
                        Researcher
                      </span>
                      <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-bold border border-green-500/40 flex items-center gap-2 shadow-lg">
                        <Star className="h-4 w-4" />
                        Published Author
                      </span>
                    </div>

                    <p className="text-gray-300 text-base mb-6 flex items-center justify-center lg:justify-start gap-2">
                      <Target className="h-5 w-5 text-amber-500" />
                      Leading Youth Strength & Conditioning Expert Worldwide
                    </p>
                  </div>
                </div>

                {/* Enhanced Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 border-t border-slate-700/50 pt-8">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-amber-500 mb-1">1000+</div>
                    <div className="text-sm text-gray-400 font-medium">Athletes Trained</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-blue-500 mb-1">10+</div>
                    <div className="text-sm text-gray-400 font-medium">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-purple-500 mb-1">PhD</div>
                    <div className="text-sm text-gray-400 font-medium">Qualified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-green-500 mb-1">0</div>
                    <div className="text-sm text-gray-400 font-medium">Injuries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            <div className="bg-slate-800/70 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50 flex items-start gap-6 hover:bg-slate-800/80 transition-all hover:scale-105 shadow-xl">
              <div className="rounded-full bg-purple-900/50 p-4 flex-shrink-0">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">10+ Years Excellence</h3>
                <p className="text-gray-300 leading-relaxed">
                  Coaching 1000+ youth athletes with proven results, innovative methodologies, and a track record of developing champions.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50 flex items-start gap-6 hover:bg-slate-800/80 transition-all hover:scale-105 shadow-xl">
              <div className="rounded-full bg-green-900/50 p-4 flex-shrink-0">
                <BookOpen className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Research Leader</h3>
                <p className="text-gray-300 leading-relaxed">
                  Published youth strength & conditioning researcher with peer-reviewed studies shaping the future of athletic development.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    A Coaching Experience Your Child Will Love
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                  Our programme is more than reps and drills — it's a creative, positive environment where young athletes
                  feel supported, challenged, and excited to train. Every session is engaging, novel, and focused —
                  because when training is fun, commitment comes naturally.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Personalized</h3>
                  <p className="text-gray-300">Tailored programs for each athlete's unique needs</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Safe & Effective</h3>
                  <p className="text-gray-300">Evidence-based methods with zero injury record</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Results Driven</h3>
                  <p className="text-gray-300">Proven track record of athletic development</p>
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
