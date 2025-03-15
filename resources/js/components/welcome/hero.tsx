"use client"

import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, LineChart, Trophy, Dumbbell } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const heroTextRef = useRef<HTMLDivElement | null>(null)
  const heroImageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const heroTl = gsap.timeline()

    // Animate hero text
    heroTl.from(heroTextRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })

    // Animate hero image
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
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-cover bg-center pt-24"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url('https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1471&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-black/70"></div>
      <div className="relative container mx-auto px-4 py-20">
        <div ref={heroTextRef} className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Track Your Athletic<span className="text-blue-400"> Progress</span>
          </h1>
          <p className="mb-8 text-lg text-gray-200">
            A comprehensive platform for young athletes to track progress, compete on leaderboards, and achieve
            their strength and conditioning goals.
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
  )
}

export default Hero
