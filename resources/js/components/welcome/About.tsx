"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  Sparkles,
  BookOpen,
  Users,
  Star,
  ArrowRight,
  GraduationCap,
  Award,
  Target,
  TrendingUp,
  Heart,
  Shield,
  Quote,
  Globe,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import gsap from "gsap"

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const credentialsRef = useRef<HTMLDivElement>(null)
  const achievementsRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // GSAP Animations
  useEffect(() => {
    if (!isVisible) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Header animation
      tl.from(headerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        // Image animation
        .from(
          imageRef.current,
          {
            x: -80,
            opacity: 0,
            duration: 1.4,
            ease: "power3.out",
          },
          "-=0.8",
        )
        // Content animation
        .from(
          contentRef.current?.children || [],
          {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=1",
        )
        // Credentials card animation
        .from(
          credentialsRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.4)",
          },
          "-=0.6",
        )
        // Achievements animation
        .from(
          achievementsRef.current?.children || [],
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4",
        )

      // Floating animations
      gsap.to(credentialsRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })

      // Parallax effect for decorative elements
      gsap.to(".floating-bg", {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.5,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isVisible])

  const achievements = [
    { icon: Users, label: "Athletes Trained", value: "1,000+", color: "blue" },
    { icon: Calendar, label: "Years Experience", value: "10+", color: "purple" },
    { icon: BookOpen, label: "Research Papers", value: "25+", color: "green" },
    { icon: Award, label: "Success Rate", value: "98%", color: "amber" },
  ]

  const credentials = [
    {
      icon: GraduationCap,
      title: "PhD in Paediatric Strength Training",
      description: "University of Birmingham",
      color: "blue",
    },
    {
      icon: Award,
      title: "UKSCA Accredited",
      description: "Strength & Conditioning Coach",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Youth Specialist Certification",
      description: "International Youth Conditioning Association",
      color: "green",
    },
    {
      icon: Globe,
      title: "Published Researcher",
      description: "Peer-reviewed journals worldwide",
      color: "amber",
    },
  ]

  const philosophyPoints = [
    {
      icon: Heart,
      title: "Enjoyment First",
      description: "Training should be fun, engaging, and something kids look forward to",
    },
    {
      icon: Target,
      title: "Individual Focus",
      description: "Every child is unique and deserves personalized attention and programming",
    },
    {
      icon: TrendingUp,
      title: "Progressive Development",
      description: "Building skills systematically while respecting developmental stages",
    },
    {
      icon: Shield,
      title: "Safety Always",
      description: "Zero compromise on safety with evidence-based injury prevention",
    },
  ]

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-0"></div>

      {/* Enhanced Decorative Elements */}
      <div className="floating-bg absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500/15 to-purple-500/15 blur-xl"></div>
      <div className="floating-bg absolute top-40 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl"></div>
      <div className="floating-bg absolute bottom-40 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl"></div>
      <div className="floating-bg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>

      {/* Enhanced Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAtMTJ2MmgtMnYtMmgyek0zMCAyNHYyaC0ydi0yaDJ6bS00IDRoMnYyaC0ydi0yek0zMCAyMHYyaC0ydi0yaDJ6bS00IDBoMnYyaC0ydi0yek0zNCAyMHYyaC0ydi0yaDJ6bTAgMTJ2MmgtMnYtMmgyek0zMCAyOHYyaC0ydi0yaDJ6bS04IDhoMnYyaC0ydi0yek0zNCAyOHYyaC0ydi0yaDJ6TTI2IDI0djJoLTJ2LTJoMnptLTQgNGgydjJoLTJ2LTJ6bTAgOGgydjJoLTJ2LTJ6bTAtOGg0djJoLTR2LTJ6bTQgMTJ2LTJoMnYyaC0yek0yNiAzNnYtMmgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 mix-blend-overlay"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <div ref={headerRef} className="relative">
          <div className="flex flex-col items-center justify-center mb-20">
            <div className="inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6 shadow-lg shadow-blue-500/25">
              <div className="bg-slate-900 rounded-full p-3">
                <GraduationCap className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-center max-w-4xl text-white mb-6 leading-tight">
              Meet Dr Ben Pullen —
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Expert in Youth Strength Development
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 text-center max-w-3xl mb-8 leading-relaxed">
              The world's leading researcher in youth strength training, transforming how young athletes develop
            </p>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/50"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start mb-20">
          {/* Enhanced Left Column - Image and Credentials */}
          <div ref={imageRef} className="xl:col-span-5 relative">
            <div className="relative group">
              {/* Enhanced Main Image with Frame */}
              <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Dr Ben Pullen - Youth Strength Training Expert"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                {/* Enhanced overlay content */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <Badge className="bg-blue-500/90 text-white border-0 font-bold">World Expert</Badge>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Credentials Card */}
              <div
                ref={credentialsRef}
                className="absolute -bottom-12 -right-8 md:-right-16 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/40 shadow-2xl shadow-blue-500/20 z-20 max-w-sm transform transition-all duration-700 group-hover:-translate-y-4 hover:border-blue-500/60"
              >
                <h3 className="text-2xl font-black text-white mb-6 flex items-center">
                  <GraduationCap className="mr-3 h-6 w-6 text-blue-400" />
                  Credentials
                </h3>
                <div className="space-y-4">
                  {credentials.slice(0, 3).map((cred, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div
                        className={`rounded-full bg-${cred.color}-900/60 p-2 flex-shrink-0 group-hover/item:bg-${cred.color}-900/80 transition-all`}
                      >
                        <cred.icon className={`h-5 w-5 text-${cred.color}-400`} />
                      </div>
                      <div>
                        <span className="text-sm text-white font-bold block">{cred.title}</span>
                        <span className="text-xs text-gray-400">{cred.description}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View all credentials link */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  View All Credentials
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Enhanced Background Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-40 h-40 border-2 border-dashed border-blue-500/30 rounded-2xl z-0 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 border-2 border-dashed border-purple-500/30 rounded-2xl z-0 animate-pulse delay-1000"></div>

              {/* Glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
            </div>
          </div>

          {/* Enhanced Right Column - Content */}
          <div ref={contentRef} className="xl:col-span-7">
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="mb-8">
                <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed font-light">
                  This programme was created to solve a clear problem: most youth training is either
                  <span className="text-blue-400 font-bold"> watered down or misapplied adult training</span>.
                </p>

                <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                  Dr Ben Pullen holds a PhD in paediatric strength training and has coached over 1,000 young athletes.
                  His research explored how to make strength training engaging and developmentally aligned - blending
                  <span className="text-purple-400 font-bold"> sport science with psychological insight</span>.
                </p>

                <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                  Now, that work is delivered to families worldwide through a structured, engaging programme that
                  delivers
                  <span className="text-green-400 font-bold"> results, builds confidence</span>, and supports parents
                  every step of the way.
                </p>
              </div>

              {/* Enhanced Philosophy Card with Quote */}
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 transform transition-all hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 mb-10 group">
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-4 mt-1 group-hover:scale-110 transition-transform">
                    <Quote className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-4 flex items-center">
                      Philosophy Highlight
                      <Sparkles className="ml-3 h-6 w-6 text-amber-400" />
                    </h3>
                    <blockquote className="text-2xl md:text-3xl italic text-blue-300 font-bold leading-relaxed mb-4">
                      "Kids don't need pressure — they need purposeful challenge. We train children to enjoy training,
                      not endure it."
                    </blockquote>
                    <cite className="text-gray-400 font-medium">— Dr Ben Pullen, PhD</cite>
                  </div>
                </div>
              </div>

              {/* Enhanced Philosophy Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {philosophyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/60 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600/50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full p-3 group-hover:scale-110 transition-transform">
                        <point.icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{point.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{point.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 group hover:scale-105">
                  Learn More About Our Approach
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-bold py-4 px-8 rounded-xl backdrop-blur-sm transition-all hover:scale-105"
                >
                  View Research Papers
                  <BookOpen className="ml-3 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Achievements Section */}
        <div ref={achievementsRef} className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              Proven Track Record of
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}
                Excellence
              </span>
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Numbers that speak to our commitment to youth athletic development
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 text-center hover:border-slate-600/50 hover:scale-105 transition-all group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-${achievement.color}-500/30 to-${achievement.color}-600/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <achievement.icon className={`h-8 w-8 text-${achievement.color}-400`} />
                </div>
                <div className={`text-3xl md:text-4xl font-black text-${achievement.color}-400 mb-2`}>
                  {achievement.value}
                </div>
                <div className="text-gray-300 font-medium text-sm">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Testimonial Section */}
        <div className="mt-20 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-full p-4">
                <Quote className="h-8 w-8 text-black" />
              </div>
            </div>
            <blockquote className="text-2xl md:text-3xl italic text-white font-bold leading-relaxed mb-6 max-w-4xl mx-auto">
              "Dr Pullen's approach revolutionized how we think about youth training. Our athletes are stronger, more
              confident, and genuinely excited about their development."
            </blockquote>
            <cite className="text-gray-400 font-medium text-lg">
              — Sarah Mitchell, Head of Youth Development, Elite Sports Academy
            </cite>
            <div className="flex justify-center mt-4 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
