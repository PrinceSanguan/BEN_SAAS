import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  category: string;
}

const LatestNews: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const newsItemsRef = useRef<HTMLDivElement | null>(null);

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

    // Animate news items
    if (newsItemsRef.current) {
      const newsItems = newsItemsRef.current.children;
      gsap.from(newsItems, {
        scrollTrigger: {
          trigger: newsItemsRef.current,
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

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "New Training Block Released for Spring Season",
      excerpt: "We've just released a new training block designed to help athletes improve explosive power and endurance for the spring season.",
      date: "March 15, 2025",
      imageUrl: "/api/placeholder/600/400",
      category: "Training"
    },
    {
      id: 2,
      title: "AthleteTrack Celebrates 1000+ Active Users",
      excerpt: "Our community is growing! We now have over 1000 athletes actively using the platform to track their progress and improve their performance.",
      date: "March 8, 2025",
      imageUrl: "/api/placeholder/600/400",
      category: "Milestone"
    },
    {
      id: 3,
      title: "Success Story: Local Team Improves Performance by 22%",
      excerpt: "A local youth sports team using AthleteTrack has seen a 22% average improvement in key performance metrics over just three months.",
      date: "February 28, 2025",
      imageUrl: "/api/placeholder/600/400",
      category: "Success Story"
    }
  ];

  return (
    <section ref={sectionRef} className="bg-[#0f172a] py-20">
      <div className="w-full px-4 mx-auto">
        <div ref={titleRef} className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Latest News</h2>
          <p className="text-lg text-gray-400">Stay updated with the latest from AthleteTrack</p>
        </div>

        <div ref={newsItemsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-[#111827] rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium">
                  {item.category}
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs text-gray-400 mb-2">{item.date}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{item.excerpt}</p>

                <a href="#" className="inline-flex items-center text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            View All News
          </a>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
