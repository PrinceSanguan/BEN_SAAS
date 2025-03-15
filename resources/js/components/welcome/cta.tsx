"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const FAQ: React.FC = () => {
  const faqRef = useRef<HTMLDivElement | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (faqRef.current) {
      gsap.from(faqRef.current, {
        scrollTrigger: {
          trigger: faqRef.current,
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

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const faqItems = [
    {
      question: "How does AthleteTrack track my progress?",
      answer:
        "AthleteTrack uses your logged workout data, test results (like jump distances, wall sit times), and session records to measure performance over time. It then visualizes your improvements with graphs and leaderboards.",
    },
    {
      question: "Is AthleteTrack free to use?",
      answer:
        "Our Basic functionality can be used without cost. However, additional features or advanced analytics can be made available via a plan decided by your organization or coach.",
    },
    {
      question: "Can I cancel or change my plan anytime?",
      answer:
        "Yes. You can upgrade, downgrade, or cancel at any time if your organization allows it. There are no hidden fees or obligations.",
    },
    {
      question: "What sports does AthleteTrack support?",
      answer:
        "AthleteTrack is primarily focused on strength and conditioning for youth athletes. It’s flexible enough to benefit many sports by tracking foundational strength, plyometrics, and endurance metrics.",
    },
  ]

  return (
    <section id="faq" ref={faqRef} className="bg-white py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to your questions about AthleteTrack
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between focus:outline-none"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    expandedFaq === index ? "rotate-180" : ""
                  } text-gray-600 dark:text-gray-400`}
                />
              </button>
              <div
                className={`mt-2 overflow-hidden transition-all ${
                  expandedFaq === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
