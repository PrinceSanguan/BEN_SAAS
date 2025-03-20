import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StatsCardsProps {
    numberOfUsers: number;
    numberOfActive: number;
    numberOfOnline: number;
}

export default function StatsCards({ numberOfUsers, numberOfActive, numberOfOnline }: StatsCardsProps) {
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animate cards with GSAP
        gsap.fromTo(
            cardsRef.current?.children || [],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' }
        );
    }, []);

    return (
        <div ref={cardsRef} className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:w-auto">
            <div className="flex h-24 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-lg transition-transform hover:scale-105">
                <div className="flex flex-col justify-between">
                    <span className="text-xs uppercase tracking-wider text-indigo-100">NUMBER OF USERS</span>
                    <span className="text-3xl font-bold text-white">{numberOfUsers}</span>
                </div>
            </div>

            <div className="flex h-24 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 p-4 shadow-lg transition-transform hover:scale-105">
                <div className="flex flex-col justify-between">
                    <span className="text-xs uppercase tracking-wider text-green-100">NUMBER OF ACTIVE</span>
                    <span className="text-3xl font-bold text-white">{numberOfActive}</span>
                </div>
            </div>

            <div className="flex h-24 rounded-lg bg-gradient-to-r from-pink-600 to-rose-500 p-4 shadow-lg transition-transform hover:scale-105">
                <div className="flex flex-col justify-between">
                    <span className="text-xs uppercase tracking-wider text-pink-100">HOW MANY ONLINE</span>
                    <span className="text-3xl font-bold text-white">{numberOfOnline}</span>
                </div>
            </div>
        </div>
    );
}
