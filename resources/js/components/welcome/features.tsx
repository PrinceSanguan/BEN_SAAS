"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart2, TrendingUp, Medal, Users, Dumbbell, LineChart } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const Features: React.FC = () => {
  const featureRefs = useRef<HTMLDivElement[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Animate section title
    gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })

    // Animate feature cards
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

      // Add hover animation
      feature.addEventListener("mouseenter", () => {
        gsap.to(feature, {
          y: -10,
          scale: 1.03,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          borderColor: "#3b82f6",
          duration: 0.3,
          ease: "power2.out",
        })
      })

      feature.addEventListener("mouseleave", () => {
        gsap.to(feature, {
          y: 0,
          scale: 1,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })
  }, [])

  const addToFeatureRefs = (el: HTMLDivElement | null) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el)
    }
  }

  return (
    <section id="features" ref={sectionRef} className="bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Features Designed for Young Athletes</h2>
          <p className="text-lg text-gray-400">
            Everything you need to track progress, build strength, and achieve your athletic potential.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <Card
            ref={addToFeatureRefs}
            className="border border-gray-800 bg-gray-800/50 transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-blue-900/30 p-3">
                <BarChart2 className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Performance Tracking</h3>
              <p className="text-gray-400">
                Track your progress in standing long jump, single-leg jumps, wall sits, and more.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card
            ref={addToFeatureRefs}
            className="border border-gray-800 bg-gray-800/50 transition-all hover:-translate-y-1 hover:border-green-500 hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-green-900/30 p-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Strength Level System</h3>
              <p className="text-gray-400">
                Earn XP for completing training sessions and level up your strength profile.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card
            ref={addToFeatureRefs}
            className="border border-gray-800 bg-gray-800/50 transition-all hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-purple-900/30 p-3">
                <Medal className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Leaderboards</h3>
              <p className="text-gray-400">
                Compete with other athletes on strength level and consistency leaderboards.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card
            ref={addToFeatureRefs}
            className="border border-gray-800 bg-gray-800/50 transition-all hover:-translate-y-1 hover:border-yellow-500 hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-yellow-900/30 p-3">
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Consistency Tracking</h3>
              <p className="text-gray-400">Monitor your training consistency with percentage-based scoring.</p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card
            ref={addToFeatureRefs}
            className="border border-gray-800 bg-gray-800/50 transition-all hover:-translate-y-1 hover:border-red-500 hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-red-900/30 p-3">
                <Dumbbell className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Structured Training</h3>
              <p className="text-gray-400">
                Follow a progressive, drip-fed 14-week program with repeated blocks of sessions.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card
            ref={addToFeatureRefs}
            className="border border-gray-800 bg-gray-800/50 transition-all hover:-translate-y-1 hover:border-teal-500 hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-teal-900/30 p-3">
                <LineChart className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Progress Visualization</h3>
              <p className="text-gray-400">
                View your improvements on detailed graphs and see percentage increases over time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Features

