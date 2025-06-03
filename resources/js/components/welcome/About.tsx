"use client"

import React from "react"
import { Sparkles, BookOpen, Users, Brain, Star, ArrowRight, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

const About: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 z-0"></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      <div className="absolute top-40 right-0 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute bottom-40 left-0 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAtMTJ2MmgtMnYtMmgyek0zMCAyNHYyaC0ydi0yaDJ6bS00IDRoMnYyaC0ydi0yek0zMCAyMHYyaC0ydi0yaDJ6bS00IDBoMnYyaC0ydi0yek0zNCAyMHYyaC0ydi0yaDJ6bTAgMTJ2MmgtMnYtMmgyek0zMCAyOHYyaC0ydi0yaDJ6bS04IDhoMnYyaC0ydi0yek0zNCAyOHYyaC0ydi0yaDJ6TTI2IDI0djJoLTJ2LTJoMnptLTQgNGgydjJoLTJ2LTJ6bTAgOGgydjJoLTJ2LTJ6bTAtOGg0djJoLTR2LTJ6bTQgMTJ2LTJoMnYyaC0yek0yNiAzNnYtMmgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Decorative Elements */}
        <div className="relative">
          <div className="flex flex-col items-center justify-center mb-16">
            <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
              <div className="bg-slate-900 rounded-full p-1.5">
                <GraduationCap className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-3xl">
              Meet Dr Ben Pullen —
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Expert in Youth Strength Development
              </span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-8 mb-2"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Image and Credentials */}
          <div className="lg:col-span-5 relative">
            <div className="relative group">
              {/* Main Image with Frame */}
              <div className="relative z-10 rounded-lg overflow-hidden border-2 border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_35px_rgba(59,130,246,0.3)] transition duration-500">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Dr Ben Pullen"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
              </div>

              {/* Star Rating */}
              <div className="absolute bottom-4 left-4 z-20 flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Floating Credentials Card */}
              <div className="absolute -bottom-8 -right-8 md:-right-12 bg-slate-800/90 backdrop-blur-md rounded-lg p-5 border border-blue-500/30 shadow-xl shadow-blue-500/10 z-20 max-w-xs transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-blue-400" />
                  Credentials
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-900/50 p-1.5 flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-sm text-white font-medium">PhD in Paediatric Strength Training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-purple-900/50 p-1.5 flex-shrink-0">
                      <Users className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-sm text-white font-medium">1,000+ Young Athletes Coached</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-900/50 p-1.5 flex-shrink-0">
                      <Brain className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-sm text-white font-medium">Published Researcher</span>
                  </div>
                </div>
              </div>

              {/* Background Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-dashed border-blue-500/20 rounded-lg z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-dashed border-purple-500/20 rounded-lg z-0"></div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7">
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                This programme was created to solve a clear problem: most youth training is either
                <span className="text-blue-400 font-medium"> watered down or misapplied adult training</span>.
              </p>

              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Dr Ben Pullen holds a PhD in paediatric strength training and has coached over 1,000 young athletes.
                His research explored how to make strength training engaging and developmentally aligned - blending
                <span className="text-purple-400 font-medium"> sport science with psychological insight</span>.
              </p>

              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Now, that work is delivered to families worldwide through a structured, engaging programme that delivers
                <span className="text-green-400 font-medium"> results, builds confidence</span>, and supports parents every step of the way.
              </p>

              {/* Philosophy Card */}
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-lg p-6 border border-blue-500/20 transform transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3 mt-1">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Philosophy Highlight</h3>
                    <p className="text-xl italic text-blue-300 font-medium leading-relaxed">
                      "Kids don't need pressure — they need purposeful challenge. We train children to enjoy training, not endure it."
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-10">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-6 rounded-md shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group">
                  Learn more about our approach
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

