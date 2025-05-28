"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Award, Users, BookOpen, Star, Activity } from "lucide-react"
import { useEffect, useState } from "react"

const Hero: React.FC = () => {
  // State to track the current background image
  const [currentBg, setCurrentBg] = useState(0);

  // Array of background images from Unsplash
  const backgroundImages = [
    "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    "https://images.unsplash.com/photo-1475762544292-d2e0ab431798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  // Effect to change background image every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgroundImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 py-4 px-6 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <span className="text-white font-bold text-xl">AthleteTrack</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              How It Works
            </a>
            <a href="#rankings" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Rankings
            </a>
            <a href="#latest-news" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Latest News
            </a>
            <a href="#testimonials" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Testimonials
            </a>
            <a href="#faq" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              FAQ
            </a>
          </nav>

          <div>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Log In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 bg-gradient-to-br from-blue-950 to-slate-900 relative overflow-hidden">
        {/* Background Image Slider with Overlay */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1500 ease-in-out ${
                index === currentBg ? "opacity-60" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            ></div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-slate-900/75 to-slate-900/70"></div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/60 opacity-50"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl mix-blend-screen"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl mix-blend-screen"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Where Young Athletes
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Train Smarter — Not Just Harder
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Expert guidance that builds performance, protects against injury, and brings out the best in your child.
              Scientifically designed, individually delivered — and fully supported for parents.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md w-full sm:w-auto flex items-center justify-center gap-2 group"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-2 border-white/30 text-white font-semibold hover:bg-white/10 rounded-md w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Expert Profile Card - Perfectly Centered */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl border border-amber-500/30 shadow-2xl overflow-hidden relative">
              {/* Expert Badge */}
              <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                EXPERT
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 p-1">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-amber-500/30">
                        <img
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                          alt="Dr Ben Pullen"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1.5">
                      <Award className="h-5 w-5 text-slate-900" />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">Dr Ben Pullen</h2>
                      <div className="flex gap-0.5">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </div>
                    </div>
                    <p className="text-lg text-amber-400 font-semibold mb-4">PhD in Paediatric Strength Training</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium border border-amber-500/30 flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Youth Expert
                      </span>
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Researcher
                      </span>
                      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Published Author
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 flex items-center justify-center md:justify-start gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      Leading Youth Strength & Conditioning Expert
                    </p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mt-6 border-t border-slate-700/50 pt-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-500">1000+</div>
                    <div className="text-xs text-gray-400">Athletes Trained</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-500">10+</div>
                    <div className="text-xs text-gray-400">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-500">PhD</div>
                    <div className="text-xs text-gray-400">Qualified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-500">0</div>
                    <div className="text-xs text-gray-400">Injuries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Cards - Perfectly Aligned Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 flex items-start gap-4">
              <div className="rounded-full bg-purple-900/50 p-3 flex-shrink-0">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">10+ Years</h3>
                <p className="text-gray-300">Coaching 1000+ youth athletes with proven results and methodologies.</p>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 flex items-start gap-4">
              <div className="rounded-full bg-green-900/50 p-3 flex-shrink-0">
                <BookOpen className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Published</h3>
                <p className="text-gray-300">
                  Youth strength & conditioning researcher with peer-reviewed publications.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                A Coaching Experience Your Child Will Love
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Our programme is more than reps and drills — it's a creative, positive environment where young athletes
                feel supported, challenged, and excited to train. Every session is engaging, novel, and focused —
                because when training is fun, commitment comes naturally.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Hero
