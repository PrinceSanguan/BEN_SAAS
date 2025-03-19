"use client"

import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Dumbbell, Medal, TrendingUp, BarChart2 } from 'lucide-react'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const heroContentRef = useRef<HTMLDivElement | null>(null)
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement | null>(null)
  const ctaButtonsRef = useRef<HTMLDivElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Initial animations
    const tl = gsap.timeline();

    // Animate overlay
    tl.from(overlayRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut"
    });

    // Animate hero title with text reveal effect
    tl.from(heroTitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5");

    // Animate hero subtitle
    tl.from(heroSubtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.7");

    // Animate CTA buttons
    tl.from(ctaButtonsRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.6");

    // Animate stats
    if (statsRef.current) {
      const stats = statsRef.current.children;
      tl.from(stats, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.4");
    }

    // Add parallax effect on scroll
    gsap.to(heroContentRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      y: 100,
      ease: "none"
    });
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/90 z-10"
        ></div>
      </div>

      {/* Hero Content */}
      <div className="container relative z-20 mx-auto px-4 py-12 md:py-20">
        <div ref={heroContentRef} className="max-w-4xl mx-auto">
          <h1
            ref={heroTitleRef}
            className="mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white"
          >
            <span className="block">Unlock Your</span>
            <span className="block mt-1 md:mt-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Athletic Potential
            </span>
          </h1>

          <p
            ref={heroSubtitleRef}
            className="mb-6 md:mb-8 text-base md:text-xl text-gray-300 max-w-3xl"
          >
            Track your progress, compete on leaderboards, and follow structured training programs
            designed to help young athletes build strength, speed, and endurance.
          </p>

          <div
            ref={ctaButtonsRef}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-10 md:mb-16"
          >
            <Button
              size="lg"
              className="h-12 md:h-14 px-6 md:px-8 bg-blue-600 text-base md:text-lg font-semibold shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/40 group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 md:h-14 px-6 md:px-8 border-2 border-white/30 text-white text-base md:text-lg font-semibold hover:bg-white/10 hover:border-white/50"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20 transform transition-transform hover:scale-105">
              <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                <div className="rounded-full bg-blue-900/50 p-1.5 md:p-2">
                  <Dumbbell className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">14+</h3>
              </div>
              <p className="text-sm md:text-base text-gray-400">Weeks of structured training</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20 transform transition-transform hover:scale-105">
              <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                <div className="rounded-full bg-purple-900/50 p-1.5 md:p-2">
                  <Medal className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">10+</h3>
              </div>
              <p className="text-sm md:text-base text-gray-400">Strength level achievements</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20 transform transition-transform hover:scale-105">
              <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                <div className="rounded-full bg-green-900/50 p-1.5 md:p-2">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">25%</h3>
              </div>
              <p className="text-sm md:text-base text-gray-400">Average performance increase</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20 transform transition-transform hover:scale-105">
              <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                <div className="rounded-full bg-yellow-900/50 p-1.5 md:p-2">
                  <BarChart2 className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">5+</h3>
              </div>
              <p className="text-sm md:text-base text-gray-400">Performance metrics tracked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="h-auto w-full">
          <path
            fill="#0f172a"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}

export default Hero
