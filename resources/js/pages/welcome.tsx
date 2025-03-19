"use client"

import { Head, usePage } from "@inertiajs/react"
import { useEffect } from "react"
import RankingSection from "@/components/ranking-section"

// Import your subcomponents
import Header from "@/components/welcome/header"
import Hero from "@/components/welcome/hero"
import About from "@/components/welcome/about"
import Features from "@/components/welcome/features"
import HowItWorks from "@/components/welcome/howitworks"
// import LatestNews from "@/components/welcome/LatestNews"
import Testimonials from "@/components/welcome/testimonials"
// import FAQ from "@/components/welcome/faq"
import CTA from "@/components/welcome/cta"
import Footer from "@/components/welcome/footer"

import type { SharedData } from "@/types"

declare global {
  interface Window {
    route: (...args: unknown[]) => string
  }
}

export default function Welcome() {
  const { auth } = usePage<SharedData>().props

  // Add dark mode class to body
  useEffect(() => {
    document.documentElement.classList.add("dark")

    return () => {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return (
    <>
      <Head title="AthleteTrack">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <meta
          name="description"
          content="AthleteTrack - The ultimate platform for tracking athletic progress, setting goals, and achieving your potential."
        />
      </Head>
      {/* Header is now imported from components/welcome/header.tsx */}
      <Header auth={auth} />
      {/* Sub-components below */}
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <RankingSection />
      {/* <LatestNews /> */}
      <Testimonials />
      {/* <FAQ /> */}
      <CTA />
      <Footer />
    </>
  )
}
