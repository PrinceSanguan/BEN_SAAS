"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Activity, Award, Target, Clock, Users, TrendingUp } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const About: React.FC = () => {
  const aboutRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLDivElement | null>(null)

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

    // Animate content
    gsap.from(contentRef.current, {
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none none",
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out",
    })

    // Animate image
    gsap.from(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none none",
      },
      x: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out",
    })

    // Animate stats
    if (statsRef.current) {
      const stats = statsRef.current.children
      gsap.from(stats, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.4,
        ease: "power3.out",
      })
    }
  }, [])

  return (
    <section id="about" ref={aboutRef} className="bg-gray-950 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mx-auto mb-10 md:mb-16 max-w-3xl text-center">
          <h2 className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold text-white">About AthleteTrack</h2>
          <p className="text-base md:text-lg text-gray-400">
            Empowering young athletes to reach their full potential through data-driven training
          </p>
        </div>

        <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">
          <div ref={contentRef} className="space-y-4 md:space-y-6 order-2 md:order-1">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="mt-1 rounded-full bg-blue-900/30 p-2 flex-shrink-0">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2">Our Mission</h3>
                <p className="text-sm md:text-base text-gray-400">
                  AthleteTrack was founded with a clear mission: to provide young athletes with the tools they need to
                  track, measure, and improve their athletic performance in a safe, engaging, and data-driven
                  environment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="mt-1 rounded-full bg-purple-900/30 p-2 flex-shrink-0">
                <Award className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2">Our Approach</h3>
                <p className="text-sm md:text-base text-gray-400">
                  We believe in the power of consistent training, measurable progress, and friendly competition. Our
                  platform combines structured training programs with gamification elements to keep young athletes
                  motivated and engaged throughout their strength and conditioning journey.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="mt-1 rounded-full bg-green-900/30 p-2 flex-shrink-0">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2">Our Team</h3>
                <p className="text-sm md:text-base text-gray-400">
                  Our team consists of experienced strength and conditioning coaches, sports scientists, and software
                  developers who are passionate about youth athletic development. We work closely with schools, sports
                  clubs, and individual coaches to create a platform that meets the needs of young athletes.
                </p>
              </div>
            </div>
          </div>

          <div ref={imageRef} className="relative order-1 md:order-2">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop"
                alt="Young athletes training"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
            </div>

            <div ref={statsRef} className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
              <div className="bg-gray-900/80 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  <h4 className="font-semibold text-white text-sm md:text-base">5+ Years</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-400">Helping young athletes improve their performance</p>
              </div>

              <div className="bg-gray-900/80 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                  <h4 className="font-semibold text-white text-sm md:text-base">10,000+</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-400">Young athletes using our platform worldwide</p>
              </div>

              <div className="bg-gray-900/80 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
                  <h4 className="font-semibold text-white text-sm md:text-base">500,000+</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-400">Training sessions completed on our platform</p>
              </div>

              <div className="bg-gray-900/80 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                  <h4 className="font-semibold text-white text-sm md:text-base">25%</h4>
                </div>
                <p className="text-xs md:text-sm text-gray-400">Average performance improvement in 3 months</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

