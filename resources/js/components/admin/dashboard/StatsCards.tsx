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
        <div ref={cardsRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex h-24 rounded-lg bg-violet-600 p-4 shadow-lg transition-transform hover:scale-105 hover:shadow-violet-500/20">
                <div className="flex flex-col justify-between">
                    <span className="text-xs uppercase tracking-wider text-violet-200">USERS</span>
                    <span className="text-3xl font-bold text-white">{numberOfUsers}</span>
                </div>
            </div>

            <div className="flex h-24 rounded-lg bg-green-600 p-4 shadow-lg transition-transform hover:scale-105 hover:shadow-green-500/20">
                <div className="flex flex-col justify-between">
                    <span className="text-xs uppercase tracking-wider text-green-200">ACTIVE</span>
                    <span className="text-3xl font-bold text-white">{numberOfActive}</span>
                </div>
            </div>

            <div className="flex h-24 rounded-lg bg-pink-600 p-4 shadow-lg transition-transform hover:scale-105 hover:shadow-pink-500/20 sm:col-span-2 md:col-span-1">
                <div className="flex flex-col justify-between">
                    <span className="text-xs uppercase tracking-wider text-pink-200">ONLINE</span>
                    <span className="text-3xl font-bold text-white">{numberOfOnline}</span>
                </div>
            </div>
        </div>
    );
}
