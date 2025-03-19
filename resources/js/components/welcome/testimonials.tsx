"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const Testimonials: React.FC = () => {
  const testimonialRefs = useRef<HTMLDivElement[]>([])
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

    // Animate testimonial cards
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

      // Add hover animation
      testimonial.addEventListener("mouseenter", () => {
        gsap.to(testimonial, {
          y: -10,
          scale: 1.03,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          duration: 0.3,
          ease: "power2.out",
        })
      })

      testimonial.addEventListener("mouseleave", () => {
        gsap.to(testimonial, {
          y: 0,
          scale: 1,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })
  }, [])

  const addToTestimonialRefs = (el: HTMLDivElement | null) => {
    if (el && !testimonialRefs.current.includes(el)) {
      testimonialRefs.current.push(el)
    }
  }

  return (
    <section id="testimonials" ref={sectionRef} className="bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">What Athletes Say</h2>
          <p className="text-lg text-gray-400">
            Join other young athletes who have improved their performance with AthleteTrack
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Testimonial 1 */}
          <Card
            ref={addToTestimonialRefs}
            className="overflow-hidden bg-gray-800 shadow-xl transition-all hover:shadow-2xl"
          >
            <div
              className="h-32 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop')",
              }}
            ></div>
            <CardContent className="relative -mt-16 rounded-t-3xl bg-gray-800 p-6">
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-300">
                "I've improved my standing long jump by 15cm in just 3 months! The leaderboards keep me motivated to
                train consistently."
              </p>
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-white font-bold">
                  JR
                </div>
                <div>
                  <p className="font-semibold text-white">JumpRocket</p>
                  <p className="text-sm text-gray-400">Strength Level 4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 2 */}
          <Card
            ref={addToTestimonialRefs}
            className="overflow-hidden bg-gray-800 shadow-xl transition-all hover:shadow-2xl"
          >
            <div
              className="h-32 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop')",
              }}
            ></div>
            <CardContent className="relative -mt-16 rounded-t-3xl bg-gray-800 p-6">
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-300">
                "The structured training program has helped me stay consistent. I'm now at the top of the consistency
                leaderboard!"
              </p>
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-green-500 text-white font-bold">
                  SP
                </div>
                <div>
                  <p className="font-semibold text-white">SpeedPhantom</p>
                  <p className="text-sm text-gray-400">98% Consistency</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 3 */}
          <Card
            ref={addToTestimonialRefs}
            className="overflow-hidden bg-gray-800 shadow-xl transition-all hover:shadow-2xl"
          >
            <div
              className="h-32 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=2069&auto=format&fit=crop')",
              }}
            ></div>
            <CardContent className="relative -mt-16 rounded-t-3xl bg-gray-800 p-6">
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-300">
                "I love seeing my progress in the graphs. My wall sit time has doubled since I started using
                AthleteTrack!"
              </p>
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-purple-500 text-white font-bold">
                  PF
                </div>
                <div>
                  <p className="font-semibold text-white">PowerFlex</p>
                  <p className="text-sm text-gray-400">Strength Level 5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

