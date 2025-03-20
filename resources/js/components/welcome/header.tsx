"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "@inertiajs/react"
import { Activity, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import gsap from "gsap"

interface User {
  id: number
  name: string
  email: string
  // Add other user properties as needed
}

interface AuthProps {
  user: User | null
}

interface HeaderProps {
  auth: AuthProps
}

const Header: React.FC<HeaderProps> = ({ auth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    // GSAP animation for header elements
    const tl = gsap.timeline()

    tl.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })

    tl.from(
      logoRef.current,
      {
        x: -20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.4",
    )

    if (navItemsRef.current) {
      const navItems = navItemsRef.current.children
      tl.from(
        navItems,
        {
          y: -20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.2",
      )
    }

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          isScrolled ? "border-gray-800 bg-gray-950/95 backdrop-blur-md shadow-lg" : "border-transparent bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div ref={logoRef} className="flex items-center gap-2">
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            <span className="text-lg md:text-xl font-bold text-white">AthleteTrack</span>
          </div>

          <nav className="hidden md:flex">
            <ul ref={navItemsRef} className="flex space-x-6 lg:space-x-8">
              <li>
                <a href="#features" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a href="#ranking" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                  Rankings
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            {auth.user ? (
              <Link href={window.route("dashboard")} className="text-sm font-medium text-white">
                <Button className="bg-blue-600 shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/20 text-xs md:text-sm px-3 md:px-4 h-9 md:h-10">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href={window.route("login")}
                  className="hidden text-sm font-medium text-gray-300 transition-colors hover:text-blue-400 md:block"
                >
                  Log in
                </Link>
                <Link href={window.route("register")} className="text-sm font-medium text-white">
                  <Button className="bg-blue-600 shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/20 text-xs md:text-sm px-3 md:px-4 h-9 md:h-10">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            <button
              className="flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-800 md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="border-t border-gray-800 px-4 py-3">
            <ul className="space-y-3">
              {["Features", "How It Works", "Rankings", "Testimonials", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={window.route("login")}
                  className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header

