import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const faqRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const faqItemsRef = useRef<HTMLDivElement | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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
    });

    // Animate FAQ items
    if (faqItemsRef.current) {
      const faqItems = faqItemsRef.current.children;
      gsap.from(faqItems, {
        scrollTrigger: {
          trigger: faqItemsRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: "How does AthleteTrack measure my progress?",
      answer:
        "AthleteTrack measures your progress through the testing sessions conducted every 5 weeks. It tracks improvements in Standing Long Jump, Single Leg Jumps (left and right), Wall Sit, High Plank, and optionally Bent Arm Hang. Your progress is visualized with percentage increases and graphs comparing your results across testing periods.",
    },
    {
      question: "What is the Strength Level system?",
      answer:
        "The Strength Level system is based on XP (experience points) you earn by completing training sessions and tests. You earn +1 XP for each completed session, +3 XP bonus for completing all fields in a week, +8 XP for completing testing sessions, and additional bonuses for consistency. You advance through levels as you accumulate XP: Level 1 (1 XP), Level 2 (3 XP total), Level 3 (6 XP total), Level 4 (10 XP total), and Level 5 (15 XP total).",
    },
    {
      question: "How is my Consistency Score calculated?",
      answer:
        "Your Consistency Score is calculated as a percentage based on the number of training and testing sessions you've completed compared to the total number that have been released in your program. The higher your consistency, the higher you'll rank on the Consistency Leaderboard. Note that the Bent Arm Hang assessment is optional and doesn't affect your consistency score.",
    },
    {
      question: "What is the training schedule like?",
      answer:
        "The training follows a structured 14-week block system. Each block includes 2 sessions per week for most weeks, with testing weeks occurring at weeks 5, 10, and 14. Week 7 is a rest week with no sessions to complete. The system releases new sessions on a drip-feed basis following this schedule.",
    },
    {
      question: "How do the leaderboards work?",
      answer:
        "AthleteTrack features two leaderboards: the Strength Level Leaderboard ranks athletes based on their XP and strength level, while the Consistency Score Leaderboard ranks athletes based on the percentage of completed sessions. The system allows for joint positions, so multiple athletes with the same scores (like 100% consistency) will share the same rank.",
    },
    {
      question: "What testing metrics are tracked?",
      answer:
        "AthleteTrack tracks six key performance metrics: Standing Long Jump (cm), Single Leg Jump Left (cm), Single Leg Jump Right (cm), Wall Sit Assessment (seconds), High Plank Assessment (seconds), and the optional Bent Arm Hang Assessment (seconds). These tests help measure your explosive power, unilateral strength, and muscular endurance.",
    },
    {
      question: "Is my personal information protected?",
      answer:
        "Yes, AthleteTrack is designed with GDPR compliance in mind, especially for athletes under 18. The system uses usernames rather than real names to protect identity, and parent email is required during registration for consent and communications purposes.",
    },
    {
      question: "Can I see my progress over time?",
      answer:
        "Yes, the 'Your Progress' section shows detailed graphs for each of your testing metrics. These graphs display your results from baseline testing through each block's testing week, along with percentage increases calculated by comparing your most recent results to your baseline.",
    },
  ];

  return (
    <section id="faq" ref={faqRef} className="bg-[#0f172a] py-20">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-400">Find answers to your questions about AthleteTrack</p>
        </div>

        <div ref={faqItemsRef} className="mx-auto max-w-3xl space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-800 bg-[#111827]/50 transition-all duration-300 overflow-visible"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-5 focus:outline-none"
              >
                <span className="font-medium text-white text-left">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                    expandedFaq === index ? "rotate-180" : ""
                  } text-gray-400`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFaq === index ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <div className="p-5 pt-0 text-sm text-gray-300 border-t border-gray-800">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
