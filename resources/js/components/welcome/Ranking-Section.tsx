"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Trophy, Medal, Award, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// Example XP-based leaderboard data
const leaderboardData = [
  {
    name: "Jane Smith",
    xp: 2850,
    avatar: "https://images.unsplash.com/photo-1598819659675-41fb63834685?fit=crop&h=200&w=200&q=80"
  },
  {
    name: "John Doe",
    xp: 2100,
    avatar: "https://images.unsplash.com/photo-1561815557-9d7ec17c72a4?fit=crop&h=200&w=200&q=80"
  },
  {
    name: "Robert Brown",
    xp: 1980,
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?fit=crop&h=200&w=200&q=80"
  }
]

/**
 * Returns a special icon for each rank:
 * 1 => Trophy, 2 => Medal, 3 => Award
 */
function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-8 w-8 text-yellow-500" />
    case 2:
      return <Medal className="h-8 w-8 text-gray-400" />
    case 3:
      return <Award className="h-8 w-8 text-amber-700" />
    default:
      return null
  }
}

/**
 * A podium display component for showing top 3 performers
 */
export default function TopThreeLeaderboard() {
  const containerRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Fade in animation for the entire section
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    )

    // Stagger animation for the cards
    const cards = (cardsRef.current as unknown as HTMLElement)?.querySelectorAll(".rank-card")
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Sort by XP descending to ensure proper ranking
  const sortedUsers = [...leaderboardData].sort((a, b) => b.xp - a.xp)

  return (
    <section
      ref={containerRef}
      className="py-16 bg-gradient-to-b from-gray-900 to-gray-950"
      id="ranking"
    >
      <div className="container px-4 mx-auto">
        <div className="max-w-lg mx-auto mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-white">
            Leaderboard Champions
          </h2>
          <p className="text-lg text-gray-400">
            Top performers recognized for their excellence
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto"
        >
          {sortedUsers.map((user, index) => {
            const rank = index + 1
            const isFirst = rank === 1

            return (
              <div
                key={user.name}
                className={`rank-card ${isFirst ? "md:order-2" : rank === 2 ? "md:order-1" : "md:order-3"}`}
              >
                <Card className={`relative overflow-hidden p-6 text-center transition-all duration-300 hover:shadow-xl bg-gray-800 ${
                  isFirst ? "border-yellow-500" :
                  rank === 2 ? "border-gray-400" :
                  "border-amber-700"
                }`}>
                  {/* Rank Banner */}
                  <div className="absolute top-0 left-0 right-0 py-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent">
                    <div className="flex items-center justify-center gap-2">
                      {getRankIcon(rank)}
                      <span className="font-bold text-lg text-white">
                        {rank === 1 ? "🏆 Champion" : rank === 2 ? "🥈 Runner-up" : "🥉 Third Place"}
                      </span>
                    </div>
                  </div>

                  {/* User Avatar */}
                  <div className="mt-10 mb-4">
                    <Avatar className={`h-24 w-24 mx-auto ring-4 ${
                      isFirst ? "ring-yellow-500" : rank === 2 ? "ring-gray-400" : "ring-amber-700"
                    } shadow-lg`}>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gray-700">
                        <User className="h-8 w-8 text-gray-300" />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* User Info */}
                  <h3 className="text-xl font-bold mb-1 text-white">{user.name}</h3>
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <Badge className={
                      isFirst
                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                        : rank === 2
                          ? "bg-gray-500 hover:bg-gray-600 text-white"
                          : "bg-amber-700 hover:bg-amber-800 text-white"
                    }>
                      {user.xp.toLocaleString()} XP
                    </Badge>
                  </div>

                  {/* Trophy/Badge Indicator */}
                  <Badge variant="outline" className={`mt-2 ${
                    isFirst
                      ? "border-yellow-500 text-yellow-500"
                      : rank === 2
                        ? "border-gray-400 text-gray-400"
                        : "border-amber-700 text-amber-700"
                  }`}>
                    {rank === 1 ? "Gold" : rank === 2 ? "Silver" : "Bronze"}
                  </Badge>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
