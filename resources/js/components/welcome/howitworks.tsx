"use client"

import React, { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const HowItWorks: React.FC = () => {
  const howItWorksRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (howItWorksRef.current) {
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
    }
  }, [])

  return (
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

        {/* Extra “YouTube Tutorials” or other blocks can remain here */}
        <div className="mt-16 rounded-xl bg-white/10 p-6 shadow-xl backdrop-blur-sm text-white">
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">🎥 Video Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  )
}

export default HowItWorks
