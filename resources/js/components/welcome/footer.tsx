"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Activity } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const columnsRef = useRef<HTMLDivElement | null>(null)
  const copyrightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Animate footer logo
    gsap.from(logoRef.current, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none none",
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })

    // Animate footer columns
    if (columnsRef.current) {
      const columns = columnsRef.current.children
      gsap.from(columns, {
        scrollTrigger: {
          trigger: columnsRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      })
    }

    // Animate copyright
    gsap.from(copyrightRef.current, {
      scrollTrigger: {
        trigger: copyrightRef.current,
        start: "top bottom-=50",
        toggleActions: "play none none none",
      },
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power3.out",
    })
  }, [])

  return (
    <footer ref={footerRef} className="bg-gray-950 py-12 text-gray-400">
      <div className="container mx-auto px-4">
        <div ref={columnsRef} className="grid gap-8 md:grid-cols-4">
          <div>
            <div ref={logoRef} className="mb-4 flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white">AthleteTrack</span>
            </div>
            <p className="mb-4">
              Helping young athletes track, analyze, and improve their performance with structured training programs.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="text-gray-400 transition-colors hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 transition-colors hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Features</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="transition-colors hover:text-white">
                  Performance Tracking
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-white">
                  Strength Level System
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-white">
                  Leaderboards
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-white">
                  Progress Visualization
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Training</h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-white">
                  Drip-Fed Blocks
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-white">
                  Testing Sessions
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-white">
                  Exercise Library
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-white">
                  Training Tips
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#faq" className="transition-colors hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div ref={copyrightRef} className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} AthleteTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

