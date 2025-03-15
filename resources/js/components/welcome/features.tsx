"use client"

import React, { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart2, TrendingUp, Medal, Users, Dumbbell, LineChart } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const Features: React.FC = () => {
  const featureRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
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
  }, [])

  const addToFeatureRefs = (el: HTMLDivElement | null) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el)
    }
  }

  return (
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
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Leaderboards
              </h3>
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
  )
}

export default Features
